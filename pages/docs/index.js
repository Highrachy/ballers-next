import React, { useState } from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { MdOutlineRocketLaunch } from 'react-icons/md';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { MdOutlineVpnKey } from 'react-icons/md';
import { MdOutlineHome } from 'react-icons/md';
import { MdOutlineSettings } from 'react-icons/md';
import { MdOutlineAssessment } from 'react-icons/md';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

const Docs = ({ featuredItems, searchData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    // Perform search
    const results = searchData.filter((item) =>
      searchQuery.split(' ').every((term) =>
        [
          item.title,
          item.subtitle,
          item.fileName, // Include the file name in the search criteria
          ...item.steps.map((step) => step.title),
          ...item.steps.map((step) => step.description),
        ]
          .join(' ')
          .toLowerCase()
          .includes(term.toLowerCase())
      )
    );
    setSearchResults(results);
    setSearchPerformed(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchPerformed(false);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const isSearchButtonDisabled = searchQuery.length < 3;

  return (
    <>
      <Header />
      <TitleSection
        name="BALL Documentation"
        content="Guiding Your Path to Homeownership and Real Estate Success with BALL"
      />
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-9 mx-auto">
            <div className="input-group btn-addon mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Search..."
                className="form-control"
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSearch}
                disabled={isSearchButtonDisabled}
              >
                Search
              </button>
            </div>
          </div>
          <div className="col-lg-12 mx-auto">
            {searchPerformed && searchResults.length > 0 ? (
              <>
                <div className="text-center">
                  <button
                    className="btn btn-secondary-light btn-sm btn-wide"
                    type="button"
                    onClick={clearSearch}
                  >
                    Clear Search
                  </button>
                </div>

                <h4 className="mt-5 mb-3">
                  Search Results for{' '}
                  <span className="text-primary">{searchQuery}</span>
                </h4>
                <SearchResults
                  query={searchQuery}
                  searchResults={searchResults}
                />
              </>
            ) : (
              <>
                {searchPerformed && <NoSearchFound query={searchQuery} />}
                <Documentation featuredItems={featuredItems} />
              </>
            )}
          </div>
        </div>
      </div>
      <CommunityGallery />
      <Footer />
    </>
  );
};

const SearchResults = ({ query, searchResults }) => (
  <div className="mt-4">
    {searchResults.map((result, index) => (
      <Link key={index} href={`docs/${result.fileName.replace('.json', '')}`}>
        <div className="card p-4 mb-5">
          <div className="card-body">
            <h5 className="card-title">
              <span className="text-secondary-dark">
                {highlightSearchTerm(result.title, query)}
              </span>
            </h5>
            <p className="card-text">
              {highlightSearchTerm(result.subtitle, query)}
            </p>
            {result.steps.some((step) => stepContainsQuery(step, query)) && (
              <div className="mb-3">
                <h6 className="card-subtitle mb-2 text-muted">
                  {highlightedStepTitle(result.steps, query)}
                </h6>
                <p className="card-text">
                  {highlightedStepDescription(result.steps, query)}
                </p>
              </div>
            )}
            <p className="text-md text-muted">
              {formatFileName(result.folder, result.fileName)}
            </p>
          </div>
        </div>
      </Link>
    ))}
  </div>
);

const formatFileName = (folder, fileName) => {
  const formattedFolderName = folder
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); // Format folder name
  const formattedFileName = fileName
    .replace(/^\d+-/, '') // Remove leading number and hyphen from the file name
    .replace(/\.json$/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); // Format file name
  return `Found in: ${formattedFolderName}/${formattedFileName}`; // Concatenate folder name and file name
};

const NoSearchFound = () => (
  <div className="text-center mt-5">
    <h4>No search results found.</h4>
  </div>
);

const stepContainsQuery = (step, query) => {
  return (
    step.title.toLowerCase().includes(query.toLowerCase()) ||
    step.description.toLowerCase().includes(query.toLowerCase())
  );
};

const highlightedStepTitle = (steps, query) => {
  const matchingStep = steps.find((step) => stepContainsQuery(step, query));
  return highlightSearchTerm(matchingStep.title, query);
};

const highlightedStepDescription = (steps, query) => {
  const matchingStep = steps.find((step) => stepContainsQuery(step, query));
  return highlightSearchTerm(matchingStep.description, query);
};

const highlightSearchTerm = (text, query) => {
  if (!query || !text) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index}>{part}</mark>
    ) : (
      part
    )
  );
};

const getIconForFolder = (folder) => {
  switch (folder) {
    case 'getting-started':
      return <MdOutlineRocketLaunch />;
    case 'property-eligibility':
      return <MdOutlineAssessment />;
    case 'user-accounts':
      return <MdOutlineAccountCircle />;
    case 'vip-accounts':
      return <MdOutlineVpnKey />;
    case 'property-management':
      return <MdOutlineHome />;
    case 'support-and-resources':
      return <MdOutlineSettings />;
    default:
      return null;
  }
};

const Documentation = ({ featuredItems }) => (
  <div className="featured-area featured-bg pt-130 pb-100 p-relative">
    <div className="container">
      <div className="row mt-6">
        {featuredItems.map((item, index) => (
          <FeaturedItem key={index} {...item} />
        ))}
      </div>
    </div>
  </div>
);

const FeaturedItem = ({ title, links }) => (
  <section className="col-xl-4 col-lg-4 col-md-6">
    <div className="mb-6">
      <div className="docs__content">
        <h3 className="docs__title mb-2">
          <span className="docs__icon me-2">{getIconForFolder(title)}</span>
          {title
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </h3>
        <div className="line"></div>
        <ul className="list-unstyled">
          {links.map((link, index) => (
            <li key={index}>
              <Link href={`docs/${link.url}`}>
                {link.label
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export async function getStaticProps() {
  const docsDirectory = path.join(process.cwd(), 'data', 'docs');
  const folders = fs.readdirSync(docsDirectory);
  let searchData = [];

  for (const folder of folders) {
    const folderPath = path.join(docsDirectory, folder);
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(jsonData);
      const steps = data.steps || []; // Ensure steps array exists
      // Add folder name, description, and file name to search data
      searchData.push({
        title: data.title,
        folder: folder,
        subtitle: data.subtitle,
        steps,
        fileName: file, // Add the file name
      });
    }
  }
  const featuredItems = folders.map((folder) => ({
    title: folder,
    links: getLinksForFolder(folder),
  }));

  return { props: { featuredItems, searchData } };
}

const getLinksForFolder = (folder) => {
  const folderPath = path.join(process.cwd(), 'data', 'docs', folder);
  const files = fs.readdirSync(folderPath);
  return files.map((file) => {
    const fileName = file.replace(/\.json$/, '');
    const label = fileName.replace(/^\d+-/, '').replace(/-/g, ' ');
    return {
      url: fileName,
      label: label.charAt(0).toUpperCase() + label.slice(1),
    };
  });
};

export default Docs;
