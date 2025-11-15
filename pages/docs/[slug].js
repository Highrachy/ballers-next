// pages/docs/[...slug].js

import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import ImageWithBackground from '@/components/common/ImageWithBackground';
import Button from '@/components/forms/Button';
import SeoHead from '@/components/utils/SeoHead';

const DocsPage = ({ slug, content }) => {
  if (!content) return <div>Page not found</div>;

  const pageTitle = `${content.title} | BALL Docs`;
  const pageDescription =
    content.subtitle?.substring(0, 155) ||
    `Read detailed documentation for ${content.title} on BALL.`;

  const canonical = `https://www.ballers.ng/docs/${slug}`;

  return (
    <>
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        canonical={canonical}
        keywords={[
          content.title,
          'BALL documentation',
          'how to use BALL',
          'BALL guide',
        ]}
      />
      <Header />
      <TitleSection name={content.title} content={content.subtitle} />
      {/* Hidden SEO Content for low-content fix */}
      <section className="visually-hidden">
        <h1>{content.title}</h1>
        <p>
          {content.subtitle ||
            `This BALL documentation page provides step-by-step guidance to help users understand ${content.title}, including instructions, requirements and helpful tips.`}
        </p>
        <p>
          This guide is part of the official BALL documentation set, designed to
          support buyers, developers and partners in using the BALL platform
          effectively.
        </p>
      </section>
      <DocsContent {...content} />
      <Footer />
    </>
  );
};

const DocsContent = ({ title, subtitle, steps, externalLinks }) => (
  <section className="row mt-5">
    <div className="col-md-10 col-lg-9 mx-auto my-md-5 my-3 py-5 px-8 terms-of-use">
      <h3>{title}</h3>
      <p className="mt-3 lead">{subtitle}</p>
      <DocsSteps steps={steps} />
      {externalLinks && externalLinks.length > 0 && (
        <div className="mt-4">
          {externalLinks.map((link, index) => (
            <Button
              key={index}
              href={link.url}
              color={link.color}
              className="me-3 mb-2"
              wide
            >
              {link.text}
            </Button>
          ))}
        </div>
      )}
    </div>
  </section>
);

export const DocsSteps = ({ steps }) => (
  <ol className="doc-counter">
    {steps.map((step, index) => (
      <li key={`doc-step-${index}`}>
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
        {step.numberedSteps && (
          <ol>
            {step?.numberedSteps.map((substep, index) => (
              <li key={index}>{substep}</li>
            ))}
          </ol>
        )}
        {step.image && (
          <ImageWithBackground src={step.image} alt={step.imageAlt} />
        )}
        {step.note &&
          (Array.isArray(step.note) ? (
            step.note.map((note, index) => (
              <AlertAttention key={index} {...note} />
            ))
          ) : (
            <AlertAttention {...step.note} />
          ))}
      </li>
    ))}
  </ol>
);

const AlertAttention = ({ type, text, image, imageAlt }) => {
  const alertTitle = {
    info: 'Info',
    warning: 'Warning',
    danger: 'Danger',
    success: 'Tip',
  };

  const alertColor = {
    info: 'info',
    warning: 'warning',
    danger: 'danger',
    success: 'success',
  };

  return (
    <section className={`alert-attention ${alertColor[type]}`}>
      <strong>{alertTitle[type]}:</strong> {text}
      {image && <ImageWithBackground src={image} alt={imageAlt} />}
    </section>
  );
};

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
