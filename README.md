// pages/docs/[docPath].tsx
import { GetStaticPaths, GetStaticProps } from "next";
import { promises as fs } from "fs";
import path from "path";
import MarkdownViewer from "../../components/MarkdownViewer";
import TocSidebar from "../../components/TocSidebar";
import FileSidebar from "../../components/FileSidebar";
import { Box, Grid } from "@chakra-ui/react";
import { useState } from "react";

interface DocPageProps {
  content: string;
  files: string[];
}

const DocPage = ({ content, files }: DocPageProps) => {
  const [toc, setToc] = useState([]);

  return (
    <Grid templateColumns="250px 3fr 1fr" gap={6} height="100vh">
      <FileSidebar files={files} />
      <MarkdownViewer content={content} setToc={setToc} />
      <TocSidebar headings={toc} />
    </Grid>
  );
};

// Fetching available markdown paths
export const getStaticPaths: GetStaticPaths = async () => {
  const docsDir = path.join(process.cwd(), "public", "docs");
  const filenames = await fs.readdir(docsDir);

  const paths = filenames.map((filename) => ({
    params: { docPath: filename.replace(".md", "") },
  }));

  return { paths, fallback: false };
};

// Fetch the markdown file content and the list of files for the sidebar
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const docPath = params?.docPath as string;
  const fullPath = path.join(process.cwd(), "public", "docs", `${docPath}.md`);
  const content = await fs.readFile(fullPath, "utf-8");

  const docsDir = path.join(process.cwd(), "public", "docs");
  const filenames = await fs.readdir(docsDir);

  return { props: { content, files: filenames } };
};

export default DocPage;
