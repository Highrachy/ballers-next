import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api';
import PostTitle from '@/components/blog/PostTitle';
import PostHeader from '@/components/blog/PostHeader';
import PostBody from '@/components/blog/PostBody';
import Tags from '@/components/blog/Tags';
import MoreStories from '@/components/blog/MoreStories';
import Header from '@/components/layout/Header';
import TitleSection from '@/components/common/TitleSection';
import { BlogContainer, SearchModal } from 'pages/blog';
import CommunityGallery from '@/components/common/CommunityGallery';
import Footer from '@/components/layout/Footer';

export default function Post({ post, posts, preview }) {
  const router = useRouter();
  const morePosts = posts?.edges;

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      {router.isFallback ? (
        <PostTitle>Loading...</PostTitle>
      ) : (
        <>
          <article>
            <Head>
              <title>{`${post.title} | Ballers`}</title>
              <meta
                property="og:image"
                content={post.featuredImage?.node.sourceUrl}
              />
            </Head>
            <Header />
            <TitleSection
              name={post.title}
              content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
            />
            <BlogContainer>
              <SearchModal />
              <PostHeader {...post} heroImage />
              <PostBody content={post.content} />
              <footer>
                {post.tags.edges.length > 0 && <Tags tags={post.tags} />}
              </footer>

              <div className="dotted-border my-6" />
              <SearchModal>
                <h3>Other Posts</h3>
              </SearchModal>
              {morePosts.length > 0 && <MoreStories posts={morePosts} />}
            </BlogContainer>
          </article>
          <CommunityGallery />
          <Footer />
        </>
      )}
    </>
  );
}

export const getStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const data = await getPostAndMorePosts(params?.slug, preview, previewData);

  return {
    props: {
      preview,
      post: data.post,
      posts: data.posts,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug();

  return {
    paths: allPosts.edges.map(({ node }) => `/posts/${node.slug}`) || [],
    fallback: true,
  };
};
