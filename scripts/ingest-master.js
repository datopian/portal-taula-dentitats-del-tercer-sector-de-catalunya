#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");
const fsp = fs.promises;
const Papa = require("papaparse");
const CkanRequest = require("@portaljs/ckan-api-client-js").default;

const ROOT_DIR = path.resolve(__dirname, "..");
const DEFAULT_FILES = {
  master: path.join(ROOT_DIR, "scripts", "Espai de Dades - MASTER.csv"),
  dictionary: path.join(ROOT_DIR, "scripts", "Espai de Dades - Dictionary.csv"),
  ambits: path.join(ROOT_DIR, "scripts", "Espai de Dades - Àmbits.csv"),
  collectives: path.join(ROOT_DIR, "scripts", "Espai de Dades - Col·lectius.csv"),
};
const DEFAULT_ORGANIZATION =
  "taula-dentitats-del-tercer-sector-de-catalunya";

const MAX_GROUP_NAME_LENGTH = 45;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const config = buildConfig(args);
  validateConfig(config);

  if (config.dryRun) {
    console.log("ℹ️  Running in dry-run mode. Pass --apply to push changes to the DMS.");
  }

  if (!config.apiKey && !config.dryRun) {
    throw new Error("CKAN_API_KEY is required when running with --apply.");
  }

  if (!config.apiKey && config.dryRun) {
    console.warn(
      "⚠️  CKAN_API_KEY is not set. Remote lookups are disabled; assuming that all datasets and groups are new."
    );
  }

  const ckanOptions =
    config.apiKey && config.ckanUrl
      ? { apiKey: config.apiKey, ckanUrl: config.ckanUrl }
      : null;

  const [dictionaryCsv, masterCsv, ambitsList, collectivesList] = await Promise.all([
    parseCsv(config.dictionaryPath),
    parseCsv(config.masterPath),
    readSimpleList(config.ambitsPath),
    readSimpleList(config.collectivesPath),
  ]);

  const headerLookup = createHeaderLookup(
    masterCsv.meta.fields && masterCsv.meta.fields.length
      ? masterCsv.meta.fields
      : Object.keys(masterCsv.rows[0] || {})
  );
  const fieldDictionary = buildFieldDictionary(dictionaryCsv.rows, headerLookup);

  const collectivesHeader = findHeaderByPortalKey(
    fieldDictionary,
    "newfieldlikegroupmultipleselectionpredefinedlist"
  );
  const collectivesFromMaster = collectivesHeader
    ? collectUniqueColumnValues(masterCsv.rows, collectivesHeader)
    : [];

  const ambitGroups = buildGroupDefinitions(ambitsList);
  const { groups: collectiveGroups, nameMap: collectiveNameMap } =
    buildCollectiveGroupDefinitions({
      predefined: collectivesList,
      additional: collectivesFromMaster,
    });
  const groups = [...ambitGroups, ...collectiveGroups];
  const groupIndex = new Map(ambitGroups.map((group) => [group.slug, group]));

  if (!config.skipGroups) {
    await syncGroups({
      groups,
      ckanOptions,
      config,
      remoteAvailable: Boolean(ckanOptions),
    });
  }

  if (config.onlyGroups) {
    console.log("✅ Finished syncing groups only.");
    return;
  }

  const slugTracker = createSlugTracker();
  const datasetNameRegistry = new Set();
  const orgCache = new Map();

  const rowsWithMeta = masterCsv.rows.map((row, index) => ({
    row,
    rowNumber: index + 2, // +1 for headers, +1 for 1-indexed row numbers
    baseSlug: slugify(row["Nom"] || row["Title"] || `dataset-${index + 1}`),
  }));

  const filteredRows = rowsWithMeta.filter((entry) => {
    if (!config.datasetSlugFilter) {
      return true;
    }
    return entry.baseSlug === config.datasetSlugFilter;
  });

  if (!filteredRows.length) {
    console.log("Nothing to ingest with the current filters.");
    return;
  }

  console.log(
    `Processing ${filteredRows.length} dataset rows (from row ${filteredRows[0].rowNumber} to ${filteredRows[filteredRows.length - 1].rowNumber})`
  );

  const summary = {
    processed: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    warnings: [],
  };

  for (const entry of filteredRows) {
    const datasetContext = buildDatasetContext({
      row: entry.row,
      rowNumber: entry.rowNumber,
      dictionary: fieldDictionary,
      slugTracker,
      baseSlug: entry.baseSlug,
      groupIndex,
      collectiveNameMap,
      datasetNameRegistry,
      config,
    });

    if (!datasetContext) {
      summary.skipped += 1;
      continue;
    }

    if (datasetContext.warnings.length) {
      summary.warnings.push(...datasetContext.warnings);
    }

    const ownerOrg = await resolveOrganization({
      requestedTitle: datasetContext.ownerOrgTitle,
      config,
      ckanOptions,
      dryRun: config.dryRun,
      cache: orgCache,
      rowNumber: entry.rowNumber,
    });

    if (!ownerOrg) {
      summary.skipped += 1;
      console.warn(
        `⚠️  Row ${entry.rowNumber}: unable to resolve organization for dataset "${datasetContext.title}". Skipping.`
      );
      continue;
    }

    datasetContext.payload.owner_org = ownerOrg;

    const action = await upsertDataset({
      payload: datasetContext.payload,
      ckanOptions,
      dryRun: config.dryRun,
      hasApi: Boolean(ckanOptions),
    });

    summary.processed += 1;
    if (action === "created") {
      summary.created += 1;
    } else if (action === "updated") {
      summary.updated += 1;
    } else {
      summary.skipped += 1;
    }
  }

  console.log(
    `\n✅ Import complete. Created: ${summary.created}, Updated: ${summary.updated}, Skipped: ${summary.skipped}.`
  );

  if (summary.warnings.length) {
    console.log("\nWarnings:");
    summary.warnings.forEach((warning) => {
      console.log(` - ${warning}`);
    });
  }
}

main().catch((error) => {
  console.error("\n❌ Failed to ingest datasets.");
  console.error(error.message || error);
  console.error(error)
  if (error && error.stack) {
    console.error(error.stack);
  }
  process.exitCode = 1;
});

function buildConfig(args) {
  const baseUrl =
    args.apiUrl ||
    process.env.API_URL ||
    "https://api.cloud.portaljs.com/@taula-dentitats-del-tercer-sector-de-catalunya";
  const datasetSlugFilter = args.dataset ? slugify(args.dataset) : undefined;

  return {
    dryRun: args.dryRun,
    skipGroups: args.skipGroups,
    onlyGroups: args.onlyGroups,
    datasetSlugFilter,
    ckanUrl: baseUrl,
    apiKey: args.apiKey || process.env.API_KEY || undefined,
    ownerOrgFallback: DEFAULT_ORGANIZATION,
    masterPath: DEFAULT_FILES.master,
    dictionaryPath: DEFAULT_FILES.dictionary,
    ambitsPath: DEFAULT_FILES.ambits,
    collectivesPath: DEFAULT_FILES.collectives,
  };
}

function validateConfig(config) {
  if (!config.ckanUrl) {
    throw new Error("Missing CKAN_URL.");
  }
}

function parseArgs(argv) {
  const args = {
    dryRun: true,
    skipGroups: false,
    onlyGroups: false,
    dataset: undefined,
    apiKey: undefined,
    apiUrl: undefined,
    help: false,
  };
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg) continue;

    switch (arg) {
      case "--apply":
        args.dryRun = false;
        break;
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--skip-groups":
        args.skipGroups = true;
        break;
      case "--groups-only":
        args.onlyGroups = true;
        break;
      case "--dataset":
        args.dataset = argv[++i];
        break;
      case "--help":
      case "-h":
        args.help = true;
        break;
      default:
        if (!arg.startsWith("--")) {
          positional.push(arg);
        } else {
          console.warn(`Unknown argument "${arg}" – ignoring.`);
        }
    }
  }

  if (positional.length && !args.apiKey) {
    args.apiKey = positional.shift();
  }
  if (positional.length && !args.apiUrl) {
    args.apiUrl = positional.shift();
  }
  if (positional.length && !args.dataset) {
    args.dataset = positional.shift();
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/ingest-master.js <apiKey> [apiUrl] [options]

Options:
  --apply                 Persist changes to the PortalJS Cloud CKAN instance.
  --dry-run               Preview the import without calling the API (default).
  --skip-groups           Do not create/update groups before ingesting datasets.
  --groups-only           Only create/update groups, skip datasets.
  --dataset <slug>        Only process the dataset whose slug matches the value.
  --help                  Show this message.
`);
}

async function parseCsv(filePath) {
  const content = await fsp.readFile(filePath, "utf8");
  const parsed = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors && parsed.errors.length) {
    const printable = parsed.errors
      .map((err) => `${err.type} on row ${err.row}: ${err.message}`)
      .join("\n");
    throw new Error(`Failed to parse ${filePath}:\n${printable}`);
  }

  const rows = parsed.data.map((row) => normalizeRow(row));
  return { rows, meta: parsed.meta };
}

async function readSimpleList(filePath) {
  const content = await fsp.readFile(filePath, "utf8");
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeRow(row) {
  return Object.entries(row).reduce((acc, [rawKey, rawValue]) => {
    if (rawKey == null || rawKey === "") {
      return acc;
    }
    const key = rawKey.replace(/\uFEFF/g, "").trim();
    let value = rawValue;
    if (typeof rawValue === "string") {
      value = rawValue.trim();
    } else if (rawValue == null) {
      value = "";
    }
    acc[key] = value;
    return acc;
  }, {});
}

function createHeaderLookup(headers) {
  const lookup = new Map();
  headers
    .map((header) => header && header.trim())
    .filter(Boolean)
    .forEach((header) => {
      const normalized = normalizeKey(header);
      lookup.set(normalized, header);
    });
  return lookup;
}

function buildFieldDictionary(dictionaryRows, headerLookup) {
  const fieldDictionary = new Map();
  dictionaryRows.forEach((row) => {
    const sourceName =
      row["Name in GSheets (MASTER sheet)"] ||
      row["Name in GSheets (MASTER sheet) "] ||
      row["Name in GSheets"];
    const portalName = row["Default name in Portal JS"];
    if (!sourceName || !portalName) {
      return;
    }

    const normalizedSource = normalizeKey(sourceName);
    let masterHeader = headerLookup.get(normalizedSource);
    if (!masterHeader && normalizedSource.endsWith("s")) {
      masterHeader = headerLookup.get(
        normalizedSource.slice(0, normalizedSource.length - 1)
      );
    }

    if (!masterHeader) {
      console.warn(
        `⚠️  Dictionary reference "${sourceName}" was not found in the MASTER CSV headers.`
      );
      return;
    }

    fieldDictionary.set(masterHeader, {
      sourceName: masterHeader,
      portalName,
      portalKey: normalizeKey(portalName),
    });
  });

  return fieldDictionary;
}

function findHeaderByPortalKey(fieldDictionary, portalKey) {
  for (const [header, mapping] of fieldDictionary.entries()) {
    if (mapping.portalKey === portalKey) {
      return header;
    }
  }
  return null;
}

function collectUniqueColumnValues(rows, header) {
  const seen = new Set();
  const values = [];
  if (!header) {
    return values;
  }

  rows.forEach((row) => {
    const raw = row[header];
    if (!raw) {
      return;
    }
    splitMultiValue(raw).forEach((value) => {
      const trimmed = value.trim();
      const slug = slugify(trimmed);
      if (!trimmed || !slug || seen.has(slug)) {
        return;
      }
      seen.add(slug);
      values.push(trimmed);
    });
  });

  return values;
}

function buildGroupDefinitions(ambits) {
  const seen = new Set();
  const groups = [];

  ambits.forEach((label) => {
    const slug = slugify(label);
    if (!slug || seen.has(slug)) {
      return;
    }
    seen.add(slug);
    const name = makeGroupName(slug);
    groups.push({
      title: label,
      slug,
      name,
    });
  });

  return groups;
}

function buildCollectiveGroupDefinitions({ predefined = [], additional = [] }) {
  const groups = [];
  const nameMap = new Map();
  const seen = new Set();

  const addLabel = (label) => {
    const title = (label || "").trim();
    if (!title) {
      return;
    }
    const slug = slugify(title);
    if (!slug || seen.has(slug)) {
      return;
    }
    const name = makeGroupName(slug, "col--");
    seen.add(slug);
    groups.push({
      title,
      slug,
      name,
    });
    nameMap.set(slug, name);
  };

  predefined.forEach((label) => addLabel(label));
  additional.forEach((label) => addLabel(label));

  return { groups, nameMap };
}

async function syncGroups({ groups, ckanOptions, config, remoteAvailable }) {
  if (!groups.length) {
    console.warn("⚠️  No groups to sync.");
    return;
  }

  if (!remoteAvailable && !config.dryRun) {
    throw new Error("CKAN_API_KEY is required to create/update groups.");
  }

  console.log(`\nSyncing ${groups.length} groups (Àmbits & Col·lectius) as CKAN groups...`);

  for (const group of groups) {
    if (!ckanOptions) {
      console.log(
        `• [dry-run] Would ensure group ${group.name} (${group.title})`
      );
      logPayload("group_upsert", {
        name: group.name,
        title: group.title,
      });
      continue;
    }

    try {
      console.log(group.name)
      await CkanRequest.get(`group_show?id=${group.name}`, {
        ...ckanOptions,
      });

      if (!config.dryRun) {
        await CkanRequest.post("group_patch", {
          json: { id: group.name, title: group.title },
          ...ckanOptions,
        });
      } else {
        logPayload("group_patch", {
          id: group.name,
          title: group.title,
        });
      }
      console.log(`• Updated group ${group.title}`);
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error;
      }

      if (config.dryRun) {
        console.log(
          `• [dry-run] Would create group ${group.title} (${group.name})`
        );
        logPayload("group_create", {
          name: group.name,
          title: group.title,
        });
        continue;
      }

      await CkanRequest.post("group_create", {
        json: { name: group.name, title: group.title },
        ...ckanOptions,
      });
      console.log(`• Created group ${group.title}`);
    }
  }
}

function buildDatasetContext({
  row,
  rowNumber,
  dictionary,
  slugTracker,
  baseSlug,
  groupIndex,
  collectiveNameMap,
  datasetNameRegistry,
  config,
}) {
  const data = {
    title: "",
    description: "",
    coverage: "",
    ownerOrgTitle: "",
    author: "",
    sourceUrl: "",
    tags: [],
    groups: [],
    collectives: [],
    warnings: [],
  };

  dictionary.forEach((mapping, header) => {
    const rawValue = row[header];
    if (!rawValue) {
      return;
    }

    switch (mapping.portalKey) {
      case "title":
        data.title = rawValue;
        break;
      case "description":
        data.description = rawValue;
        break;
      case "organization":
        data.ownerOrgTitle = rawValue;
        break;
      case "author":
        data.author = rawValue;
        break;
      case "coverage":
        data.coverage = rawValue;
        break;
      case "sourcesurl":
        data.sourceUrl = rawValue;
        break;
      case "tags":
        data.tags = splitMultiValue(rawValue);
        break;
      case "group":
        data.groups = mapValuesToSlugs(rawValue);
        break;
      case "newfieldlikegroupmultipleselectionpredefinedlist":
        data.collectives = mapValuesToSlugs(rawValue);
        break;
      default:
        break;
    }
  });

  if (!data.title) {
    data.title = row["Nom"] || row["Title"] || "";
  }

  if (!data.title) {
    console.warn(`⚠️  Row ${rowNumber}: missing title. Skipping row.`);
    return null;
  }

  const slug = slugTracker.next(baseSlug || slugify(data.title));
  const datasetName = ensureUniqueDatasetName(
    slug,
    datasetNameRegistry,
    50
  );

  const groupPayload = buildGroupPayload(data.groups, groupIndex, rowNumber);
  data.warnings.push(...groupPayload.warnings);

  const collectiveGroupPayload = buildCollectiveGroupAssignments(
    data.collectives,
    collectiveNameMap,
    rowNumber
  );
  data.warnings.push(...collectiveGroupPayload.warnings);

  const resources = buildResources(data, rowNumber);
  data.warnings.push(...resources.warnings);

  const payload = {
    name: datasetName,
    title: data.title,
    notes: data.description,
    author: data.author || undefined,
    coverage: data.coverage || undefined,
    source: data.sourceUrl || undefined,
    state: "active",
    private: false,
    type: "dataset",
    tags: buildTags(data.tags),
    groups: mergeGroupAssignments(
      groupPayload.groups,
      collectiveGroupPayload.groups
    ),
    resources: resources.resources,
  };

  return {
    title: data.title,
    payload,
    warnings: data.warnings,
    ownerOrgTitle: data.ownerOrgTitle,
  };
}

async function resolveOrganization({
  requestedTitle,
  config,
  ckanOptions,
  dryRun,
  cache,
  rowNumber,
}) {
  let normalized = requestedTitle ? slugify(requestedTitle) : "";
  if (!normalized && config.ownerOrgFallback) {
    normalized = config.ownerOrgFallback;
  }

  if (!normalized) {
    return null;
  }

  const privateName = normalized;
  if (cache.has(privateName)) {
    return privateName;
  }

  if (!ckanOptions) {
    cache.set(privateName, true);
    if (dryRun) {
      console.log(
        `• [dry-run] Would ensure organization ${privateName} for row ${rowNumber}`
      );
    }
    return privateName;
  }

  try {
    await CkanRequest.post(`organization_show?id=${privateName}`, {
      ...ckanOptions,
    });
    cache.set(privateName, true);
    return privateName;
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
  }

  if (dryRun) {
    console.log(
      `• [dry-run] Would create organization ${privateName} (${requestedTitle || privateName})`
    );
    cache.set(privateName, true);
    return privateName;
  }

    await CkanRequest.post("organization_create", {
      json: {
        name: privateName,
        title: requestedTitle || privateName,
        description: "",
        state: "active",
      },
      ...ckanOptions,
    });
  cache.set(privateName, true);
  console.log(`• Created organization ${requestedTitle || privateName}`);
  return privateName;
}

async function upsertDataset({ payload, ckanOptions, dryRun, hasApi }) {
  if (!hasApi) {
    console.log(
      `• [dry-run] Would create dataset ${payload.title} (${payload.name}) with ${payload.resources.length} resources.`
    );
    logPayload("package_create", payload);
    return "created";
  }

  let exists = false;
  try {
    await CkanRequest.post(`package_show?id=${payload.name}`, {
      ...ckanOptions,
    });
    exists = true;
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
  }

  if (dryRun) {
    console.log(
      `• [dry-run] Would ${exists ? "update" : "create"} dataset ${payload.title}`
    );
    logPayload(exists ? "package_update" : "package_create", payload);
    return exists ? "updated" : "created";
  }

  if (exists) {
    await CkanRequest.post("package_update", {
      json: payload,
      ...ckanOptions,
    });
    console.log(`• Updated dataset ${payload.title}`);
    return "updated";
  }

  await CkanRequest.post("package_create", {
    json: payload,
    ...ckanOptions,
  });
  console.log(`• Created dataset ${payload.title}`);
  return "created";
}

function buildGroupPayload(groupSlugs, groupIndex, rowNumber) {
  const warnings = [];
  const groups = groupSlugs
    .map((slug) => {
      if (!groupIndex.has(slug)) {
        warnings.push(
          `Row ${rowNumber}: Àmbit "${slug}" does not match any predefined group`
        );
        return null;
      }

      const group = groupIndex.get(slug);
      return { name: group.name };
    })
    .filter(Boolean);

  return { groups, warnings };
}

function buildCollectiveGroupAssignments(values, nameMap, rowNumber) {
  const warnings = [];
  const assignments = values
    .map((slug) => {
      if (!slug) {
        return null;
      }
      const name = nameMap.get(slug);
      if (!name) {
        warnings.push(
          `Row ${rowNumber}: Col·lectiu "${slug}" does not match any known collective`
        );
        return null;
      }
      return { name };
    })
    .filter(Boolean);

  return { groups: assignments, warnings };
}

function buildResources(data, rowNumber) {
  const warnings = [];
  if (!data.sourceUrl) {
    return { resources: [], warnings };
  }

  const resource = {
    name: data.title,
    url: data.sourceUrl,
    description: data.author ? `Font: ${data.author}` : undefined,
  };

  return { resources: [resource], warnings };
}

function buildTags(labels) {
  return labels.map((label) => ({
    name: label.trim(),
  }));
}

function mergeGroupAssignments(...lists) {
  const merged = [];
  const seen = new Set();
  lists
    .flat()
    .filter(Boolean)
    .forEach((group) => {
      if (!group.name || seen.has(group.name)) {
        return;
      }
      seen.add(group.name);
      merged.push(group);
    });
  return merged;
}

function logPayload(label, data) {
  console.log(`   Payload for ${label}:`);
  console.log(JSON.stringify(data, null, 2));
}

function mapValuesToSlugs(value) {
  return splitMultiValue(value).map((item) => slugify(item));
}

function splitMultiValue(value) {
  if (!value || typeof value !== "string") {
    return [];
  }

  const result = [];
  let buffer = "";
  let depth = 0;

  for (const char of value) {
    if (char === "(") {
      depth += 1;
      buffer += char;
      continue;
    }

    if (char === ")" && depth > 0) {
      depth -= 1;
      buffer += char;
      continue;
    }

    if ((char === "," || char === ";") && depth === 0) {
      const trimmed = buffer.trim();
      if (trimmed) {
        result.push(trimmed);
      }
      buffer = "";
      continue;
    }

    buffer += char;
  }

  const finalValue = buffer.trim();
  if (finalValue) {
    result.push(finalValue);
  }
  return result;
}

function createSlugTracker() {
  const counts = new Map();
  return {
    next(preferred) {
      const base = preferred || "dataset";
      const count = counts.get(base) || 0;
      counts.set(base, count + 1);
      if (!count) {
        return base;
      }
      return `${base}-${count}`;
    },
  };
}

function slugify(value) {
  if (!value) {
    return "";
  }
  return value
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeGroupName(slug, prefix = "") {
  const availableLength = Math.max(
    MAX_GROUP_NAME_LENGTH - prefix.length,
    1
  );
  const base = slug.slice(0, availableLength);
  return `${prefix}${base}`;
}

function ensureUniqueDatasetName(slug, registry, maxLength = 50) {
  const availableLength = Math.max(maxLength, 1);
  let base = slug.slice(0, availableLength);
  if (!base) {
    base = slug.slice(0, availableLength);
  }

  let candidate = base;
  let counter = 2;
  while (registry.has(candidate)) {
    const suffix = `-${counter}`;
    const trimmedBase = base.slice(
      0,
      Math.max(availableLength - suffix.length, 1)
    );
    candidate = `${trimmedBase}${suffix}`;
    counter += 1;
  }

  registry.add(candidate);
  return candidate;
}

function isNotFoundError(error) {
  return error?.error?.__type === "Not Found Error";
}

function normalizeKey(value) {
  return slugify(value).replace(/-/g, "");
}
