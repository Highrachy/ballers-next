import React from 'react';
import { Card } from 'react-bootstrap';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import Input from 'components/forms/Input';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  BALL_COMMUNITY_CATEGORY,
  BASE_API_URL,
  EDITOR_MENU,
} from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { createCommunitySchema } from 'components/forms/schemas/communitySchema';
import { useRouter } from 'next/router';
import TitleSection from '@/components/common/TitleSection';
import Editor from '@/components/forms/Editor';
import Select from '@/components/forms/Select';
import { statusIsSuccessful, valuesToOptions } from '@/utils/helpers';
import Header from '@/components/layout/Header';
import CommunityGallery from '@/components/common/CommunityGallery';
import Footer from '@/components/layout/Footer';
import { UserContext } from '@/context/UserContext';
import { communityCommentSchema } from '@/components/forms/schemas/communitySchema';
import Textarea from '@/components/forms/Textarea';
import SeoHead from '@/components/utils/SeoHead';

const AddCommunity = () => {
  const [toast, setToast] = useToast();
  const router = useRouter();
  let { userState } = React.useContext(UserContext);
  const userName = `${userState.firstName} ${userState.lastName}`;

  return (
    <>
      <SeoHead
        title="Start a New Discussion | BALL Community"
        description="Join the BALL community and start a new discussion topic. Share insights, ask questions, and connect with other homebuyers and real estate enthusiasts in Nigeria."
        canonical="https://www.ballers.ng/community/new"
        keywords={[
          'BALL community',
          'real estate forum Nigeria',
          'property discussion',
          'homeownership discussion',
          'BALL forums',
          'new topic community',
        ]}
      />

      <Header />
      <TitleSection
        name="Add New Topic"
        content="Contribute to the BALL Community by starting a new discussion topic."
      />

      {/* Hidden SEO content for page depth and readability */}
      <section className="visually-hidden">
        <h2>Start a New Discussion in the BALL Community</h2>
        <p>
          Contribute to the BALL Community by creating a new discussion topic.
          Share your ideas, ask questions, and engage with fellow members
          interested in homeownership, property investment, and real estate
          trends in Nigeria.
        </p>
        <p>
          Starting a topic is easy. Provide a clear title, choose the
          appropriate category, and write a detailed description or question.
          This helps other community members respond with useful insights and
          advice.
        </p>
        <p>
          Members can discuss property buying, financing options, verified
          developers, and payment plans. The community encourages learning,
          sharing experiences, and helping each other make informed property
          decisions.
        </p>
        <p>
          BALL ensures a safe and respectful environment. All discussions are
          moderated to prevent misinformation and maintain a helpful and
          constructive community.
        </p>
        <p>
          By participating, you can gain insights from experienced homebuyers,
          connect with verified property developers, and discover tips for
          successful property ownership and investment.
        </p>
      </section>

      <section className="container my-md-5 my-3 py-5 px-7 terms-of-use">
        {userState?.isLoggedIn ? (
          <>
            <CommunityHeader>
              <h2>Start a Discussion</h2>
              <p className="text-muted">
                Contribute to the community conversation by creating a new
                discussion topic. Share insights, ask questions, and connect
                with fellow members on topics related to homeownership and real
                estate.
              </p>
            </CommunityHeader>

            <div className="container-fluid pt-0">
              <CommunityForm user={userState} />
            </div>
          </>
        ) : (
          <CommunitySignInForm />
        )}
      </section>

      <CommunityGallery />
      <Footer />
    </>
  );
};

const CommunityForm = ({ user }) => {
  const [toast, setToast] = useToast();
  const router = useRouter();
  return (
    <Formik
      initialValues={setInitialValues(createCommunitySchema)}
      onSubmit={(payload, actions) => {
        Axios({
          method: 'post',
          url: `${BASE_API_URL}/community`,
          data: payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status } = response;
            if (status === 201) {
              setToast({
                type: 'success',
                message: 'Community added successfully',
              });
              actions.resetForm();
              router.push('/community'); // Redirect to the community page
            }
          })
          .catch(function (error) {
            setToast({
              message: error.response.data.message,
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(createCommunitySchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} showToastOnly />

          <Card className="card-container no-border-top">
            <section className="row">
              <div className="col-md-10 px-4">
                <Input label="Title" name="title" placeholder="Enter title" />
                <Select
                  label="Category"
                  name="category"
                  options={valuesToOptions(BALL_COMMUNITY_CATEGORY)}
                  placeholder="Select Category"
                />
                <Editor
                  menuType={EDITOR_MENU.LITE}
                  label="Content"
                  name="content"
                  placeholder="A detailed content of the topic"
                />
                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Add Discussion
                </Button>
                <DisplayFormikState {...props} showAll />
              </div>
            </section>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export const CommunityHeader = ({ children, className }) => {
  return (
    <section className={`container-fluid pb-0 ${className}`}>
      <div className="community__header">{children}</div>
    </section>
  );
};

export const CommunitySignInForm = ({ text }) => (
  <Card className="card-container">
    <section className="row">
      <div className="p-6 text-center">
        <h3>Create an account to join the community</h3>
        <div className="text-muted">
          You need to be a member of the community to{' '}
          {text || 'leave a comment'}
        </div>
        <Button className="mt-4 me-3" href="/login">
          {' '}
          Sign In
        </Button>
        <Button color="primary" className="mt-4" href="/register">
          Create an Account
        </Button>
      </div>
    </section>
  </Card>
);

export const AddCommentForm = ({ communityId, onAddComment }) => {
  const [toast, setToast] = useToast();

  const handleSubmit = async (payload, actions) => {
    try {
      const response = await Axios({
        method: 'post',
        url: `${BASE_API_URL}/community/add-comment/${communityId}`, // Update with the correct URL and communityId
        data: payload,
        headers: { Authorization: getTokenFromStore() },
      });

      if (statusIsSuccessful(response.status)) {
        const newComments = response.data.community.comments; // Assuming the API returns the newly created comment
        onAddComment(newComments); // Add the new comment to the state in CommunitySingle
        setToast({
          type: 'success',
          message: 'Comment added successfully',
        });
        actions.setSubmitting(false);
        actions.resetForm();
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response.data.message,
      });
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={setInitialValues(communityCommentSchema)}
      onSubmit={handleSubmit}
      validationSchema={createSchema(communityCommentSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} showToastOnly />
          <Card className="card-container comment-section">
            <section className="row">
              <div className="col-md-10 px-4">
                <h5 id="comment-section">Add New Comment</h5>
                <Textarea
                  name="content"
                  placeholder="Enter your comment here"
                  rows={5}
                />
                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Add Comment
                </Button>
              </div>
            </section>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default AddCommunity;
