import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import PostTitle from '@/components/blog/PostTitle';
import MoreStories from '@/components/blog/MoreStories';
import Header from '@/components/layout/Header';
import { BlogContainer } from 'pages/blog';
import { getAllCategories, getSingleCategory } from 'lib/api';
import TitleSection from '@/components/common/TitleSection';
import { convertToNormalCase } from '@/utils/helpers';
import Footer from '@/components/layout/Footer';

export default function Post({ posts, slug }) {
  const router = useRouter();

  const allPosts = posts?.edges;

  const categoryName = convertToNormalCase(slug) || '';

  if (!router.isFallback && !allPosts) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{`Category: ${categoryName} | Ballers`}</title>
      </Head>
      <Header />
      <TitleSection
        name={`Category: ${categoryName}`}
        content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
      />
      {router.isFallback ? (
        <>
          <h2 className="text-center my-8 text-muted">Loading</h2>
        </>
      ) : (
        <BlogContainer>
          {allPosts.length > 0 ? (
            <MoreStories posts={allPosts} />
          ) : (
            <h2 className="text-center my-8 text-muted">No posts found</h2>
          )}
        </BlogContainer>
      )}
      <Footer />
    </>
  );
}

export const getStaticProps = async ({ params }) => {
  const slug = params?.slug;
  const data = await getSingleCategory(slug);
  console.log('data: ', data);

  return {
    props: {
      posts: data.posts,
      slug,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const allCategories = await getAllCategories();

  return {
    paths: allCategories.nodes.map((category) => {
      console.log('category', category);
      return {
        params: {
          slug: category.slug.toString(),
        },
      };
    }),
    fallback: true,
  };
};
