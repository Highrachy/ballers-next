// pages/docs/[...slug].js

import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Image from 'next/image';

const DocsPage = ({ slug, content }) => {
  if (!content) return <div>Page not found</div>;

  return (
    <>
      <Header />
      <TitleSection name={content.title} content={content.subtitle} />
      <Content {...content} />
      <Footer />
    </>
  );
};

const Content = ({ title, subtitle, steps }) => (
  <section className="row mt-5">
    <div className="container my-md-5 my-3 py-5 px-8 terms-of-use">
      <h3>{title}</h3>
      <p className="mt-3 lead">{subtitle}</p>
      <ol className="doc-counter">
        {steps.map((step) => (
          <li key={step.id}>
            <strong>{step.title}</strong>
            <p
              dangerouslySetInnerHTML={{
                __html: convertLinks(step.description),
              }}
            />
            {step.substeps && (
              <ul>
                {step?.substeps.map((substep, index) => (
                  <li key={index}>{substep}</li>
                ))}
              </ul>
            )}
            {step.image && (
              <Image
                src={step.image}
                alt={step.imageAlt}
                width={1487}
                height={847}
                className="img-fluid bordered my-5"
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  </section>
);

// Function to convert links in the description into anchor links
const convertLinks = (description) => {
  const linkRegex = /((http|https):\/\/[^\s]+)/g;
  return description.replace(
    linkRegex,
    (match) => `<a href="${match}">${match}</a>`
  );
};

export async function getStaticPaths() {
  const docsDirectory = path.join(process.cwd(), 'data', 'docs');
  const paths = await getAllFilePaths(docsDirectory);

  return { paths, fallback: false };
}

const getAllFilePaths = async (dir) => {
  const folders = await fs.readdir(dir);
  let filePaths = [];

  for (const folder of folders) {
    const folderPath = path.join(dir, folder);
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const slug = file.replace(/\.json$/, '');
      filePaths.push({
        params: { slug },
      });
    }
  }

  return filePaths;
};

export async function getStaticProps({ params }) {
  const { slug } = params;
  const docsDirectory = path.join(process.cwd(), 'data', 'docs');
  const content = await getFileContent(docsDirectory, slug);

  return { props: { slug, content } };
}

const getFileContent = async (dir, slug) => {
  const folders = await fs.readdir(dir);

  for (const folder of folders) {
    const folderPath = path.join(dir, folder);
    const files = await fs.readdir(folderPath);
    if (files.includes(`${slug}.json`)) {
      const filePath = path.join(folderPath, `${slug}.json`);
      const jsonData = await fs.readFile(filePath, 'utf8');
      return JSON.parse(jsonData);
    }
  }

  return null; // File not found
};

export default DocsPage;
