import React, { useState } from 'react';
import Button from '../forms/Button';
import DropdownButton from '../forms/DropdownButton';
import Modal from '../common/Modal';
import { BASE_API_URL, BLOG_STATUS } from '@/utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from '@/utils/localStorage';
import { getError } from '@/utils/helpers';
import { useCurrentRole } from '@/hooks/useUser';

const PostActionButtons = ({ post, setToast, isAdmin, isPublic }) => {
  const [showPublishModal, setShowPublishModal] = useState(false);

  return (
    <section className="mt-3 d-flex">
      <Button wide color="secondary-light" href={`/posts/${post.slug}`}>
        View
      </Button>
      {!isPublic && isAdmin && (
        <>
          <DropdownButton
            wide
            className="ms-2"
            color="info-light"
            dropdownItems={[
              { text: 'Edit', href: `/admin/blog/edit/${post._id}` },
              {
                text:
                  post.status === BLOG_STATUS.PUBLISHED
                    ? 'Convert to Draft'
                    : 'Publish Post',
                onClick: () => setShowPublishModal(true),
              },
            ]}
          >
            Manage
          </DropdownButton>
          <PublishPostModal
            post={post}
            showPublishModal={showPublishModal}
            setShowPublishModal={setShowPublishModal}
            setToast={setToast}
          />
        </>
      )}
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

  const isPublished = post?.status === BLOG_STATUS.PUBLISHED;

  const updateBlogStatus = () => {
    const payload = {
      status: isPublished ? BLOG_STATUS.DRAFT : BLOG_STATUS.PUBLISHED,
    };
    setLoading(true);

    Axios.put(`${BASE_API_URL}/blog/${post?._id}`, payload, {
      headers: { Authorization: getTokenFromStore() },
    })
      .then(function (response) {
        const { status } = response;
        if (status === 200) {
          setToast({
            message: `Blog post has been successfully ${
              isPublished ? 'saved as draft' : 'published'
            }`,
            type: 'success',
          });
          setShowPublishModal(false);
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
      title={isPublished ? 'Save Blog Post as Draft' : 'Publish Blog Post'}
      show={showPublishModal}
      onHide={() => setShowPublishModal(false)}
      showFooter={false}
    >
      <section className="row">
        <div className="my-3 text-center col-md-12">
          <p className="mx-3 my-4 confirmation-text fw-bold">
            Are you sure you want to{' '}
            {isPublished ? 'convert this to draft' : 'publish post'} this post:
            <span className="text-primary"> {post?.title}</span>
          </p>
          <Button className="mb-5 btn btn-danger" onClick={updateBlogStatus}>
            {isPublished ? 'Convert to Draft' : 'Publish Post'} Blog Post
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default PostActionButtons;
