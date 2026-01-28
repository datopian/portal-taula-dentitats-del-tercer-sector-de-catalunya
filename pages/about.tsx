import Layout from "@/components/_shared/Layout";
import { getMarkdownContent } from "@/lib/markdown";
import MarkdownRenderer from "@/components/_shared/MarkdownRender";
import { NextSeo } from "next-seo";
import { siteTitle } from "@/next-seo.config";

export const getServerSideProps = async () => {
  const content = await getMarkdownContent(`about.md`)
  return {
    props: {
      content,
    },
  };
};

export default function AboutPage({ content }: { content: string }) {
  return (
    <Layout>
      <NextSeo title={`Què és l’Espai de Dades del Tercer Sector Social | ${siteTitle}`} />
      <main className="custom-container py-8">
        <MarkdownRenderer content={content} />
      </main>
    </Layout>
  );
}
