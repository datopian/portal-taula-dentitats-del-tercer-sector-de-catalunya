import { GetServerSideProps } from "next";
import Head from "next/head";
import DatasetList from "../../components/_shared/DatasetList";
import Layout from "../../components/_shared/Layout";
import Tabs from "../../components/_shared/Tabs";
import styles from "@/styles/DatasetInfo.module.scss";
import GroupNavCrumbs from "../../components/groups/individualPage/GroupNavCrumbs";
import GroupInfo from "../../components/groups/individualPage/GroupInfo";
import { getGroup } from "@/lib/queries/groups";
import { getAllDatasetsOf } from "@/lib/queries/dataset";
import HeroSection from "@/components/_shared/HeroSection";
import { GroupIndividualPageStructuredData } from "@/components/schema/GroupIndividualPageStructuredData";
import useTranslation from "next-translate/useTranslation";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const groupName = context.params?.groupName;
  if (!groupName) {
    return {
      notFound: true,
    };
  }
  let group = await getGroup({
    name: groupName as string,
    include_datasets: false,
  });
  group = {
    ...group,
    packages: await getAllDatasetsOf({ groupName: group.name }),
  };
  if (!group) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      group,
    },
  };
};

export default function GroupPage({ group }): JSX.Element {
  const { t } = useTranslation("common");
  const tabs = [
    {
      id: "datasets",
      content: group.packages ? (
        <DatasetList datasets={group.packages ? group.packages : []} />
      ) : (
        ""
      ),
      title: t("datasets"),
    },
  ];

  return (
    <>
      <GroupIndividualPageStructuredData group={group} />
      {group && (
        <Layout>
          <HeroSection title={group.title} cols="6" />
          <GroupNavCrumbs
            group={{
              name: group?.name,
              title: group?.title,
            }}
          />
          <div className="grid grid-rows-datasetpage-hero mt-8">
            <section className="grid row-start-2 row-span-2 col-span-full">
              <div className="custom-container">
                {group && (
                  <main className={styles.main}>
                    <GroupInfo group={group} />
                    <div>
                      <Tabs items={tabs} />
                    </div>
                  </main>
                )}
              </div>
            </section>
          </div>
        </Layout>
      )}
    </>
  );
}
