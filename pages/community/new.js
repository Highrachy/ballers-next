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
import { BALL_COMMUNITY_CATEGORY, BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { createCommunitySchema } from 'components/forms/schemas/communitySchema';
import { useRouter } from 'next/router';
import TitleSection from '@/components/common/TitleSection';
import MdEditor from '@/components/forms/MdEditor';
import Select from '@/components/forms/Select';
import { valuesToOptions } from '@/utils/helpers';
import Header from '@/components/layout/Header';
import CommunityGallery from '@/components/common/CommunityGallery';
import Footer from '@/components/layout/Footer';
import { UserContext } from '@/context/UserContext';
import { communityCommentSchema } from '@/components/forms/schemas/communitySchema';

const AddCommunity = () => {
  const [toast, setToast] = useToast();
  const router = useRouter();
  let { userState } = React.useContext(UserContext);
  const userName = `${userState.firstName} ${userState.lastName}`;

  return (
    <>
      <Header />
      <TitleSection
        name="Add New Topic"
        content="Contribute to the BALL Community by starting a new discussion topic. "
      />

      <section className="container my-md-5 my-3 py-5 px-7 terms-of-use">
        {userState?.isLoggedIn ? (
          <>
            <CommunityHeader>
              <h2>Start a Discussion</h2>
              <p className="text-muted">
                Contribute to the community conversation by creating a new
                discussion topic. Share insights, ask questions, and connect
                with fellow members on topics related to home ownership and real
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
                <MdEditor
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
        <Button className="mt-4 me-3"> Sign In</Button>
        <Button color="primary" className="mt-4">
          Create an Account
        </Button>
      </div>
    </section>
  </Card>
);

export const AddCommentForm = ({ communityId }) => {
  const [toast, setToast] = useToast();
  const router = useRouter();

  return (
    <Formik
      initialValues={setInitialValues(communityCommentSchema)}
      onSubmit={(payload, actions) => {
        Axios({
          method: 'post',
          url: `${BASE_API_URL}/community/add-comment/${communityId}`, // Update with the correct URL and communityId
          data: payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status } = response;
            if (status === 201) {
              setToast({
                type: 'success',
                message: 'Comment added successfully',
              });
              actions.resetForm();
              actions.setSubmitting(false);
              // Redirect or refresh page as needed
            }
          })
          .catch(function (error) {
            setToast({
              type: 'error',
              message: error.response.data.message,
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(communityCommentSchema)}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form>
          <Toast {...toast} showToastOnly />
          <Card className="card-container comment-section">
            <section className="row">
              <div className="col-md-10 px-4">
                <h5 id="comment-section">Add New Comment</h5>
                <MdEditor
                  label="Content"
                  name="content"
                  placeholder="Enter your comment here"
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
