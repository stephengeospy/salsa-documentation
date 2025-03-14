// pages/docs/index.tsx
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { promises as fs } from "fs";
import path from "path";
import { useEffect } from "react";

interface DocsPageProps {
  files: string[];
}

const DocsPage = ({ files }: DocsPageProps) => {
  const router = useRouter();

  // Redirect to the first file if no file is selected
  useEffect(() => {
    if (!router.query.docPath && files.length > 0) {
      router.push(`/docs/${files[0].replace(".md", "")}`);
    }
  }, [router, files]);

  return null;
};

// Fetch the list of markdown files in the `public/docs` folder
export const getStaticProps: GetStaticProps = async () => {
  const docsDir = path.join(process.cwd(), "public", "docs");
  const filenames = await fs.readdir(docsDir);

  return { props: { files: filenames } };
};

export default DocsPage;
