import { getAllOrganizations } from "@/lib/queries/orgs";
import { getAllGroups } from "@/lib/queries/groups";
import { searchDatasets } from "@/lib/queries/dataset";
import { url as siteUrl } from "@/next-seo.config";

const STATIC_PATHS = [
  "/",
  "/cerca",
  "/entitats",
  "/ambits",
  "/collectius",
  "/que-es",
  "/contacte",
];

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function getServerSideProps({ res }) {
  const urls: string[] = STATIC_PATHS.map((path) => `${siteUrl}${path}`);

  const [orgs, groups] = await Promise.all([
    getAllOrganizations({ detailed: false }),
    getAllGroups({ detailed: true }),
  ]);

  orgs.forEach((org) => {
    if (org?.name) {
      urls.push(`${siteUrl}/@${encodeURIComponent(org.name)}`);
    }
  });

  groups.forEach((group) => {
    if (!group?.name) return;
    const isCollectiu = group.name.includes("col--");
    const basePath = isCollectiu ? "/collectius" : "/ambits";
    urls.push(`${siteUrl}${basePath}/${encodeURIComponent(group.name)}`);
  });

  const limit = 1000;
  let offset = 0;
  let total = 0;
  do {
    const result = await searchDatasets({
      offset,
      limit,
      tags: [],
      groups: [],
      orgs: [],
      type: "dataset",
    });
    total = result.count || 0;
    (result.datasets || []).forEach((dataset) => {
      const orgName = dataset.organization?.name || dataset.organization?.title;
      if (orgName && dataset.name) {
        urls.push(
          `${siteUrl}/@${encodeURIComponent(orgName)}/${encodeURIComponent(
            dataset.name
          )}`
        );
      }
    });
    offset += limit;
  } while (offset < total);

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls
      .map((loc) => `<url><loc>${xmlEscape(loc)}</loc></url>`)
      .join("") +
    `</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
