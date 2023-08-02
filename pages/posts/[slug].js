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
import Button from '@/components/forms/Button';
import Modal from '@/components/common/Modal';
import { Form, Formik } from 'formik';
import Input from '@/components/forms/Input';
import Textarea from '@/components/forms/Textarea';
import React from 'react';
import { createSchema } from '@/components/forms/schemas/schema-helpers';
import { blogCommentSchema } from '@/components/forms/schemas/blogSchema';
import axios from 'axios';
import { WORDPRESS_API_URL } from '@/utils/constants';
import { useToast } from '@/components/utils/Toast';
import { Card, ListGroup } from 'react-bootstrap';
import { getShortDate, getTinyDate } from '@/utils/date-helpers';

export default function Post({ post, posts, preview }) {
  const router = useRouter();
  const morePosts = posts?.edges;
  const [toast, setToast] = useToast();

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

              <Comments post={post} />

              <AddComments postId={post.postId} />

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

const AddComments = ({ postId, setToast }) => {
  const [showCommentModal, setShowCommentModal] = React.useState(false);
  return (
    <div className="my-5">
      <Button onClick={() => setShowCommentModal(true)}>Add Comment</Button>
      <Modal
        title="Add comment"
        show={showCommentModal}
        onHide={() => setShowCommentModal(false)}
        showFooter={false}
      >
        <section className="px-4 pt-3">
          <Formik
            initialValues={{
              author: '',
              content: '',
            }}
            onSubmit={async (values, actions) => {
              // Create the GraphQL mutation query to add a comment
              const mutation = `
      mutation CREATE_COMMENT {
        createComment(input:{
          commentOn: ${postId},
          content: "${values.content}",
          author: "${values.author}",
        }) {
          success
          comment {
            id
            content
            author {
              node {
                name
              }
            }
          }
        }
      }
    `;

              try {
                // Make the POST request to the WPGraphQL endpoint
                const response = await axios.post(WORDPRESS_API_URL, {
                  query: mutation,
                });

                if (response.status === 200) {
                  setToast({
                    type: 'success',
                    message: `Your comment has been received and is currently being reviewed. Once approved, it will be shared with everyone. Thanks for sharing your thoughts!`,
                  });
                  setShowCommentModal(false);
                  actions.setSubmitting(false);
                }
              } catch (error) {
                // Handle errors (e.g., show an error message)
                setToast({
                  message: getError(error),
                });
                actions.setSubmitting(false);
                console.error('Error adding comment:', error);
              }

              console.log('values', values);
            }}
            validationSchema={createSchema(blogCommentSchema)}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <Form>
                  <Input
                    label="Full Name"
                    name="author"
                    placeholder="Enter your full name"
                  />
                  <Textarea
                    label="Your Comment"
                    name="content"
                    placeholder="Your Comment"
                  />
                  <Button
                    loading={isSubmitting}
                    className="mb-5"
                    onClick={handleSubmit}
                  >
                    Add Comment
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </section>
      </Modal>
    </div>
  );
};

const Comments = ({ post }) => {
  console.log('post in comment', post);
  const comments = post?.comments?.nodes || [];
  if (comments.length === 0) return null;
  return (
    <div className="mt-5">
      <h3>Comments</h3>
      {comments.map(({ content, id, author, date }) => (
        <section className="w-100 mb-4" key={id}>
          <aside className="conversation-list">
            <div className="clearfix">
              <div className="conversation-text">
                <div className="ctext-wrap">
                  <i>{author?.node?.name}</i>
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                  <div className="text-end text-sm text-muted">
                    on {new Date(date.replace(' ', 'T')).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      ))}
    </div>
  );
};

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
