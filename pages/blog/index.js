import React from 'react';
import { getAllCategories, getAllPostsForHome } from 'lib/api';
import HeroPost from '@/components/blog/HeroPost';
import MoreStories from '@/components/blog/MoreStories';
import Header from 'components/layout/Header';
import TitleSection from '@/components/common/TitleSection';
import Footer from '@/components/layout/Footer';
import { SearchIcon } from '@/components/utils/Icons';
import Link from 'next/link';
import Modal from '@/components/common/Modal';
import Input from '@/components/forms/Input';
import { Form, Formik } from 'formik';
import Button from '@/components/forms/Button';
import { searchSchema } from '@/components/forms/schemas/blogSchema';
import { createSchema } from '@/components/forms/schemas/schema-helpers';
import CommunityGallery from '@/components/common/CommunityGallery';
import { useRouter } from 'next/router';

const ArticlesPage = ({ allPosts: { edges }, allCategories }) => {
  const heroPost = edges[0]?.node;
  const morePosts = edges.slice(1);

  return (
    <>
      <Header />
      <TitleSection
        name="Blog"
        content="Unlocking the Pathway to Homeownership: Explore, Engage, and Empower with BALL."
      />
      <BlogContainer>
        <SearchModal>
          <h3>Latest Articles</h3>
        </SearchModal>

        {heroPost && <HeroPost {...heroPost} />}
        <div className="dotted-border my-6"></div>
        {/* <h2 className="mt-6 mb-4">More Posts</h2> */}
        <CategoriesComponent categories={allCategories} />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </BlogContainer>
      <CommunityGallery />
      <Footer />
    </>
  );
};

export const BlogContainer = ({ children }) => (
  <section className="container-fluid py-6">
    <div className="row">
      <div className="col-md-8 col-10 mx-auto">{children}</div>
    </div>
  </section>
);

export const CategoriesComponent = ({ categories }) => {
  return (
    <SearchModal>
      <ul className="list-inline blog-categories-list">
        <li className="list-inline-item active">
          <Link href="/blog/category">All Articles</Link>
        </li>
        {categories.nodes.map((category) => (
          <li key={category.slug} className="list-inline-item">
            <Link href={`/blog/category/${category.slug}`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </SearchModal>
  );
};

export const SearchModal = ({ children }) => {
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const router = useRouter();
  return (
    <div className="d-flex justify-content-between align-items-center mb-5">
      <div>{children}</div>
      <span
        onClick={() => setShowSearchModal(true)}
        className="blog-search-button"
      >
        <SearchIcon /> &nbsp; Search Articles
      </span>
      <Modal
        title="Search our Articles"
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        showFooter={false}
      >
        <section className="px-4 pt-3">
          <Formik
            initialValues={{
              term: '',
            }}
            onSubmit={(values, actions) => {
              router.push(`/blog/search/${values?.term}`);
            }}
            validationSchema={createSchema(searchSchema)}
          >
            {({ isSubmitting, handleSubmit }) => {
              const submitFormWithEnterKey = (event) => {
                if (event.keyCode === 13) {
                  handleSubmit();
                }
              };
              return (
                <Form>
                  <Input
                    label="Search Term"
                    name="term"
                    onKeyDown={(e) => submitFormWithEnterKey(e)}
                    placeholder="Enter search term"
                    tabIndex={1}
                  />
                  <Button
                    loading={isSubmitting}
                    className="mb-5"
                    onClick={handleSubmit}
                  >
                    Search Articles
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

export default ArticlesPage;

export const getStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview);
  const allCategories = await getAllCategories(preview);

  return {
    props: { allPosts, allCategories, preview },
    revalidate: 10,
  };
};
