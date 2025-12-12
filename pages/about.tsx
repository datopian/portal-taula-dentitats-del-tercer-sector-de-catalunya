import Layout from "@/components/_shared/Layout";
import { getMarkdownContent } from "@/lib/markdown";
import MarkdownRenderer from "@/components/_shared/MarkdownRender";

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
      <main className="custom-container py-8">
        <MarkdownRenderer content={content} />
      </main>
    </Layout>
  );
}