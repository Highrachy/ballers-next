import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import PostTitle from '@/components/blog/PostTitle';
import MoreStories from '@/components/blog/MoreStories';
import Header from '@/components/layout/Header';
import { BlogContainer, SearchModal } from 'pages/blog';
import { getAllCategories, getSingleCategory, searchPost } from 'lib/api';
import TitleSection from '@/components/common/TitleSection';
import { convertToNormalCase } from '@/utils/helpers';
import Footer from '@/components/layout/Footer';

export default function Post({ posts, term }) {
  const router = useRouter();

  const allPosts = posts?.edges;

  const searchTerm = convertToNormalCase(term) || '';

  if (!router.isFallback && !allPosts) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{`Search: ${searchTerm} | Ballers`}</title>
      </Head>
      <Header />
      <TitleSection
        name={`Search: ${searchTerm}`}
        content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
      />
      {router.isFallback ? (
        <>
          <h2 className="text-center my-8">Loading...</h2>
        </>
      ) : (
        <BlogContainer>
          <SearchModal>
            <h3>
              Search Result for{' '}
              <span className="text-danger">{searchTerm}</span>
            </h3>
          </SearchModal>
          {allPosts.length > 0 ? (
            <MoreStories posts={allPosts} />
          ) : (
            <h2 className="text-center my-8 text-muted">
              No posts found with the term{' '}
              <span className="text-danger">{searchTerm}</span>
            </h2>
          )}
        </BlogContainer>
      )}
      <Footer />
    </>
  );
}

export const getStaticProps = async ({ params }) => {
  const term = params?.term;
  const data = await searchPost(term);

  return {
    props: {
      posts: data.posts,
      term,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const allCategories = await getAllCategories();

  return {
    paths: allCategories.nodes.map((category) => {
      return {
        params: {
          term: category.slug.toString(),
        },
      };
    }),
    fallback: true,
  };
};
