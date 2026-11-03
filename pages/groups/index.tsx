import useTranslation from "next-translate/useTranslation";
import MiniSearch from "minisearch";
import ListOfGroups from "../../components/groups/ListOfGroups";
import Layout from "../../components/_shared/Layout";
import { useState } from "react";
import SearchHero from "../../components/dataset/_shared/SearchHero";
import { Group } from "@portaljs/ckan";
import { getAllGroups } from "@/lib/queries/groups";
import { GroupPageStructuredData } from "@/components/schema/GroupPageStructuredData";

export async function getServerSideProps() {
  const groups = await getAllGroups({ detailed: true });

  // Àmbits without datasets are hidden
  const ambits = groups.filter(
    (g) => !g.name.includes("col--") && g.package_count > 0
  );
  
  return {
    props: {
      groups: ambits,
    },
  };
}

export default function GroupsPage({ groups }): JSX.Element {
  const miniSearch = new MiniSearch({
    fields: ["description", "display_name"], // fields to index for full-text search
    storeFields: ["description", "display_name", "image_display_url", "name"], // fields to return with search results
  });
  miniSearch.addAll(groups);
  return (
    <>
      <GroupPageStructuredData title="Àmbits" path="/ambits" />
      <Main miniSearch={miniSearch} groups={groups} />
    </>
  );
}

function Main({
  miniSearch,
  groups,
}: {
  miniSearch: MiniSearch<any>;
  groups: Array<Group>;
}) {
  const [searchString, setSearchString] = useState("");
  const { t } = useTranslation("common");
  return (
    <Layout>
      <SearchHero
        title="Àmbits"
        searchValue={searchString}
        onChange={setSearchString}
        description={t("intro.groups")}
      />
      <main className="custom-container py-8">
        <ListOfGroups
          groups={groups}
          searchString={searchString}
          miniSearch={miniSearch}
        />
      </main>
    </Layout>
  );
}
