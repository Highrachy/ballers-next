import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api';
import PostTitle from '@/components/blog/PostTitle';
import PostHeader from '@/components/blog/PostHeader';
import PostBody from '@/components/blog/PostBody';
import Tags from '@/components/blog/Tags';
import SectionSeparator from '@/components/blog/SectionSeparator';
import MoreStories from '@/components/blog/MoreStories';
import Header from '@/components/layout/Header';
import TitleSection from '@/components/common/TitleSection';
import { BlogContainer } from 'pages/blog';

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
            <BlogContainer>
              <PostHeader {...post} heroImage />
              <PostBody content={post.content} />
              <footer>
                {post.tags.edges.length > 0 && <Tags tags={post.tags} />}
              </footer>

              <SectionSeparator />
              {morePosts.length > 0 && <MoreStories posts={morePosts} />}
            </BlogContainer>
          </article>
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
