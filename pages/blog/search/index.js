import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import TitleSection from '@/components/common/TitleSection';
import Footer from '@/components/layout/Footer';
import React from 'react';
import { getAllCategories, searchPost } from 'lib/api';

export default function Post({ posts, slug }) {
  const router = useRouter();
  const { term } = router.query;

  // Function to fetch search results
  const search = async (searchTerm) => {
    try {
      const data = await searchPost(searchTerm);
      return data;
    } catch (error) {
      console.error('Error fetching search results:', error);
      return [];
    }
  };

  React.useEffect(() => {
    if (term) {
      search(term).then((searchResults) => {
        // Do something with searchResults, e.g., update state or render
        console.log('Search results:', searchResults);
      });
    }
  }, [term]);

  const categoryName = 'Ball';

  return (
    <>
      <Head>
        <title>{`Search: ${categoryName} | Ballers`}</title>
      </Head>
      <Header />
      <TitleSection
        name={`Category: ${categoryName}`}
        content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
      />
      <Footer />
    </>
  );
}
