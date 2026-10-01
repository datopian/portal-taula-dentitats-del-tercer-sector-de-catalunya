import type { InferGetServerSidePropsType } from "next";
import MainSection from "../components/home/mainSection/MainSection";
import { searchDatasets } from "@/lib/queries/dataset";
import { getAllGroups } from "@/lib/queries/groups";
import { getAllOrganizations } from "@/lib/queries/orgs";
import HeroSectionLight from "@/components/home/heroSectionLight";
import { HomePageStructuredData } from "@/components/schema/HomePageStructuredData";

export async function getServerSideProps() {
  const datasets = await searchDatasets({
    offset: 0,
    limit: 5,
    tags: [],
    groups: [],
    orgs: [],
    type: "dataset"
  });
  const visualizations = await searchDatasets({
    offset: 0,
    limit: 0,
    tags: [],
    groups: [],
    orgs: [],
    type: "visualization"
  });
  const groups = await getAllGroups({ detailed: true });
  const ambits = groups.filter(g => !g.name.includes("col--"))
  const collectius = groups.filter(g => g.name.includes("col--"))
  const orgs = await getAllOrganizations({ detailed: true });
  const stats = {
    datasetCount: datasets.count,
    groupCount: ambits.length,
    collectiusCount: collectius.length,
    // One entry per organization ("Tercer sector" and "Altres organismes"),
    // with "Altres organismes" always last
    orgs: [...orgs]
      .sort(
        (a, b) =>
          Number(a.name.endsWith("altres-organismes")) -
          Number(b.name.endsWith("altres-organismes"))
      )
      .map((o) => ({
        name: o.name,
        title: o.display_name ?? o.title,
        datasetCount: o.package_count ?? 0,
      })),
    visualizationCount: visualizations.count
  };
  return {
    props: {
      datasets: datasets.datasets,
      groups: ambits,
      orgs,
      stats,
    },
  };
}

export default function Home({
  datasets,
  groups,
  orgs,
  stats,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  return (
    <>
      <HomePageStructuredData />
      <HeroSectionLight stats={stats} />
      <MainSection groups={groups} datasets={datasets} />
    </>
  );
}
