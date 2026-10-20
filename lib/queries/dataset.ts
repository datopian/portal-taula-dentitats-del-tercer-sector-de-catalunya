import { CKAN } from "@portaljs/ckan";
import {
  privateToPublicDatasetName,
  privateToPublicOrgName,
  publicToPrivateDatasetName,
} from "./utils";
import { Dataset, PackageSearchOptions } from "@/schemas/dataset.interface";
import CkanRequest, { CkanResponse } from "@portaljs/ckan-api-client-js";

const DMS = process.env.NEXT_PUBLIC_DMS;
const mainOrg = process.env.NEXT_PUBLIC_ORG;

export async function searchDatasets(options: PackageSearchOptions) {
  const baseAction = `package_search`;
  const tagVocabName = mainOrg ? `vocab_portal-tags--${mainOrg}` : "tags";

  const facetFields = ["groups", "organization", "res_format", tagVocabName]
    .map((f) => `"${f}"`)
    .join(",");

  let queryParams: string[] = [];

  if (options?.query) {
    queryParams.push(`q=${options.query}`);
  }

  if (options?.offset) {
    queryParams.push(`start=${options.offset}`);
  }

  if (options?.limit || options?.limit == 0) {
    queryParams.push(`rows=${options.limit}`);
  }

  if (options?.sort) {
    queryParams.push(`sort=${options?.sort}`);
  }

  let fqList: string[] = [mainOrg ? `main_org:${mainOrg}` : ""];

  if (options?.fq) {
    fqList.push(options.fq);
  }

  let fqListGroups: string[] = [];
  if (options?.orgs?.length) {
    fqListGroups.push(`organization:(${joinTermsWithOr(options?.orgs)})`);
  }

  if (options?.groups?.length) {
    fqListGroups.push(`groups:(${joinTermsWithOr(options?.groups)})`);
  }

  if (options?.tags?.length) {
    fqListGroups.push(`${tagVocabName}:(${joinTermsWithOr(options?.tags)})`);
  }

  if (options?.resFormat?.length) {
    fqListGroups.push(`res_format:(${joinTermsWithOr(options.resFormat)})`);
  }

  if (options?.type) {
    fqListGroups.push(`dataset_type:${options.type}`);
  }

  if (fqListGroups?.length) {
    fqList.push(`+(${fqListGroups.join(" AND ")})`);
  }

  if (fqList?.length) {
    queryParams.push(`fq=${fqList.join(" ")}`);
  }

  const action = `${baseAction}?${queryParams.join(
    "&"
  )}&facet.field=[${facetFields}]&facet.limit=9999`;

  const res = await CkanRequest.get<
    CkanResponse<{
      results: Dataset[];
      count: number;
      search_facets: {
        [k: string]: {
          title: string;
          items: { name: string; display_name: string; count: number }[];
        };
      };
    }>
  >(action, { ckanUrl: DMS });

  const facets = res.result && res.result.search_facets;
  if (facets && tagVocabName in facets) {
    res.result.search_facets["tags"] = facets[tagVocabName];
  }

  return { ...res.result, datasets: res.result.results };
}

const joinTermsWithOr = (tems) => {
  return tems.map((t) => `"${t}"`).join(" OR ");
};

export const getDataset = async ({ name }: { name: string }) => {
  const DMS = process.env.NEXT_PUBLIC_DMS;
  const ckan = new CKAN(DMS);
  const privateName = publicToPrivateDatasetName(name);
  const dataset = await ckan.getDatasetDetails(privateName);
  dataset.name = privateToPublicDatasetName(dataset.name);

  return {
    ...dataset,
    _name: privateName,
    organization: {
      ...dataset.organization,
      name: privateToPublicOrgName(dataset.organization.name),
    },
  };
};

// All datasets of an organization or group. `organization_show` / `group_show`
// with `include_datasets` only return the first 10, and fetching each dataset
// separately is slow, so use a single package_search (which includes resources).
// The search index stores tenant-prefixed names, so organizations are matched
// by id and groups by their prefixed name.
export const getAllDatasetsOf = async ({
  orgId,
  groupName,
}: {
  orgId?: string;
  groupName?: string;
}) => {
  const tenant = (DMS ?? "").split("/@")[1];
  const fq = orgId
    ? `owner_org:"${orgId}"`
    : `groups:"${tenant ? `${tenant}-group--${groupName}` : groupName}"`;

  const { datasets } = await searchDatasets({
    offset: 0,
    limit: 1000,
    tags: [],
    orgs: [],
    groups: [],
    fq,
    sort: "title_string asc",
  });

  return datasets.map((dataset) => ({
    ...dataset,
    name: privateToPublicDatasetName(dataset.name),
    organization: {
      ...dataset.organization,
      name: privateToPublicOrgName(dataset.organization.name),
    },
  }));
};
