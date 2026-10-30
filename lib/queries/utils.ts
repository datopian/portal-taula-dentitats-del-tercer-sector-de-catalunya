const mainOrg = process.env.NEXT_PUBLIC_ORG;
const mainGroup = mainOrg ? `${mainOrg}-group` : undefined;

export const publicToPrivateDatasetName = (publicName: string) => {
  if (!mainOrg) {
    return publicName;
  }

  return `${mainOrg}--${publicName}`;
};

export const privateToPublicDatasetName = (privateName: string) => {
  if (!mainOrg) {
    return privateName;
  }

  const mainOrgPrefix = `${mainOrg}--`;
  let publicName = privateName;

  if (privateName.startsWith(mainOrgPrefix)) {
    publicName = publicName.slice(mainOrgPrefix.length);
  }

  return publicName;
};

export const publicToPrivateGroupName = (publicName: string) => {
  if (!mainOrg) {
    return publicName;
  }

  if (publicName === mainGroup) {
    return mainGroup;
  }

  return `${mainGroup}--${publicName}`;
};

export const privateToPublicGroupName = (privateName: string) => {
  if (!mainOrg) {
    return privateName;
  }

  if (privateName === mainGroup) {
    return mainGroup;
  }

  const mainGroupPrefix = `${mainGroup}--`;
  let publicName = privateName;

  if (privateName.startsWith(mainGroupPrefix)) {
    publicName = publicName.slice(mainGroupPrefix.length);
  }

  return publicName;
};

export const publicToPrivateOrgName = (publicName: string) => {
  if (!mainOrg) {
    return publicName;
  }

  if (publicName === mainOrg) {
    return mainOrg;
  }

  return `${mainOrg}--${publicName}`;
};

export const privateToPublicOrgName = (privateName: string) => {
  if (!mainOrg) {
    return privateName;
  }

  if (privateName === mainOrg) {
    return mainOrg;
  }

  const mainOrgPrefix = `${mainOrg}--`;
  let publicName = privateName;

  if (privateName.startsWith(mainOrgPrefix)) {
    publicName = publicName.slice(mainOrgPrefix.length);
  }
  return publicName;
};

// "Altres" groups (àmbit "altres" and col·lectiu "col--altres") are catch-all
// categories and must always be listed last, regardless of the base order
const isAltresGroup = (name: string) =>
  name === "altres" || name.endsWith("--altres");

export const moveAltresGroupsLast = <T extends { name: string }>(
  groups: T[]
) => [
  ...groups.filter((g) => !isAltresGroup(g.name)),
  ...groups.filter((g) => isAltresGroup(g.name)),
];

// Order of the àmbits and col·lectius in the search filters and on their
// pages (AMB-05). Change it here:
//   "alphabetical" → A–Z by name
//   "count"        → most datasets first (A–Z when tied)
// "Altres" is always listed last.
export const GROUPS_ORDER = "alphabetical" as "alphabetical" | "count";

// Accents and case don't affect the order ("Àmbit" sorts with "Ambit"). Plain
// string comparison instead of localeCompare so server and browser agree.
const sortKey = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Labelled = { name: string; display_name?: string; title?: string };

const compareLabels = (a: Labelled, b: Labelled) => {
  const la = sortKey(a.display_name || a.title || a.name);
  const lb = sortKey(b.display_name || b.title || b.name);
  return la < lb ? -1 : la > lb ? 1 : 0;
};

// A–Z by label (e.g. the Etiquetes filter)
export const sortByLabel = <T extends Labelled>(items: T[]) =>
  [...items].sort(compareLabels);

export const sortGroups = <
  T extends Labelled & { count?: number; package_count?: number }
>(
  groups: T[]
) => {
  const count = (g: T) => g.count ?? g.package_count ?? 0;
  const sorted = [...groups].sort((a, b) => {
    if (GROUPS_ORDER === "count" && count(a) !== count(b)) {
      return count(b) - count(a);
    }
    return compareLabels(a, b);
  });
  return moveAltresGroupsLast(sorted);
};
