import React, { useState } from 'react';
import Button from '../forms/Button';
import DropdownButton from '../forms/DropdownButton';
import Modal from '../common/Modal';
import { BASE_API_URL, BLOG_STATUS } from '@/utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from '@/utils/localStorage';
import { getError } from '@/utils/helpers';
import { useCurrentRole } from '@/hooks/useUser';

const PostActionButtons = ({ post }) => {
  const isAdmin = useCurrentRole().isAdmin;
  const [showPublishModal, setShowPublishModal] = useState(false);

  return (
    <section className="mt-3 d-flex">
      <Button wide color="secondary-light" className={'me-3'}>
        View
      </Button>
      {isAdmin && (
        <DropdownButton
          wide
          color="info-light"
          dropdownItems={[
            { text: 'Edit', href: `/admin/blog/edit/${post._id}` },
            {
              text: 'Mark as Publish',
              onClick: () => setShowPublishModal(true),
            },
          ]}
        >
          Manage
        </DropdownButton>
      )}
      <PublishPostModal
        post={post}
        showPublishModal={showPublishModal}
        setShowPublishModal={setShowPublishModal}
      />
    </section>
  );
};

const PublishPostModal = ({
  post,
  showPublishModal,
  setShowPublishModal,
  setToast = () => {},
}) => {
  const [loading, setLoading] = useState(false);

  const publishBlog = () => {
    const payload = { status: BLOG_STATUS.PUBLISHED };
    setLoading(true);

    Axios.put(`${BASE_API_URL}/blog/${post?._id}`, payload, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status } = response;
        if (status === 200) {
          setToast({
            message: 'Blog post has been successfully published',
            type: 'success',
          });
          setShowAcceptModal(false);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };
  return (
    <Modal
      title="Publish Blog Post"
      show={showPublishModal}
      onHide={() => setShowPublishModal(false)}
      showFooter={false}
    >
      <section className="row">
        <div className="col-md-12 my-3 text-center">
          <p className="my-4 mx-3 confirmation-text fw-bold">
            Are you sure you want to publish this post:
            <span className="text-primary">{post?.title}</span>
          </p>
          <Button className="btn btn-danger mb-5" onClick={publishBlog}>
            Publish Blog Post
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default PostActionButtons;
