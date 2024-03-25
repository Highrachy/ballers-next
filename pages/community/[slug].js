import React, { useEffect, useState } from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Toast, { useToast } from 'components/utils/Toast';
import { API_ENDPOINT } from 'utils/URL';
import Axios from 'axios';
import { ThreeDotsIcon } from '@/components/utils/Icons';
import Button from '@/components/forms/Button';
import { FaRegCalendarAlt, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { IoIosHeart } from 'react-icons/io';
import BallersSpinner from '@/components/utils/BallersSpinner';
import { UserContext } from '@/context/UserContext';
import { BASE_API_URL, DASHBOARD_PAGE } from '@/utils/constants';
import { getTokenFromStore } from '@/utils/localStorage';
import { OnlineImage } from '@/components/utils/Image';
import { AddCommentForm } from './new';
import { getLongDate, getShortDate } from '@/utils/date-helpers';

const CommunitySingle = ({ community }) => {
  const [toast, setToast] = useToast();

  if (!community) {
    return null;
  }

  return (
    <>
      <Header />
      <TitleSection name="Single Community" content={community.title} />
      <ForumTable community={community} />
      <SingleThread communityId={community._id} comments={community.comments} />
      <AddCommentForm communityId={community._id} />
      <CommunityGallery />
      <Footer />
    </>
  );
};

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const response = await Axios.get(API_ENDPOINT.getCommunityBySlug(slug));

  const community = response.data.result[0] || {};

  return {
    props: {
      community,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  const response = await Axios.get(API_ENDPOINT.getAllCommunityTopics());
  const communities = response?.data?.result || [];

  return {
    paths: communities.map((community) => ({
      params: { slug: community?.slug },
    })),
    fallback: true,
  };
}

const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <ThreeDotsIcon />
  </a>
));

CustomToggle.displayName = 'CustomToggle';

const ForumTable = ({ community }) => {
  console.log('community', community);
  const authorComment = community?.comments[0];
  const author = authorComment?.author;

  return (
    <section className="container-fluid pb-0">
      <div className="community__header mt-5">
        <div className="d-flex justify-content-between align-content-center">
          <div>
            <h3>{community.title}</h3>
            <p className="mb-1">
              by {author?.firstName}, {getLongDate(authorComment.postedAt)}
            </p>
            <div className="badge rounded-pill bg-primary community__category-badge">
              Category: {community.category}
            </div>
          </div>
          <div className="ms-5 flex-shrink-0">
            <Button href="#comment-section" color="primary">
              Add a Comment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CommunityHeader = ({ children }) => {
  return (
    <section className="container-fluid pb-0">
      <div className="community__header">{children}</div>
    </section>
  );
};

const SingleThread = ({ communityId, ...props }) => {
  const [loadingMap, setLoadingMap] = useState({}); // Maintain loading state for each comment
  const [comments, setComments] = useState(props?.comments);
  let { userState } = React.useContext(UserContext);
  const userId = userState._id?.toString();

  const updateCommentLikes = (commentId, userId) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment._id === commentId) {
          if (!comment.likes.includes(userId)) {
            // Add like if the user has not liked the comment
            comment.likes.push(userId);

            // Remove userId from dislikes if present
            comment.dislikes = comment.dislikes.filter((id) => id !== userId);
          } else {
            // Remove like if the user has already liked the comment
            comment.likes = comment.likes.filter((id) => id !== userId);
          }
        }
        return comment;
      })
    );
  };

  const updateCommentDislikes = (commentId, userId) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment._id === commentId) {
          if (!comment.dislikes.includes(userId)) {
            // Add dislike if the user has not disliked the comment
            comment.dislikes.push(userId);

            // Remove userId from likes if present
            comment.likes = comment.likes.filter((id) => id !== userId);
          } else {
            // Remove dislike if the user has already disliked the comment
            comment.dislikes = comment.dislikes.filter((id) => id !== userId);
          }
        }
        return comment;
      })
    );
  };

  const handleLike = (commentId) => {
    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [commentId]: true, // Set loading state for the current comment
    }));

    Axios.put(
      `${BASE_API_URL}/community/like-comment/${communityId}/${commentId}`,
      {},
      {
        headers: {
          Authorization: getTokenFromStore(),
        },
      }
    )
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          updateCommentLikes(commentId, userId);
        }
      })
      .catch(() => {
        // Handle error
      })
      .finally(() => {
        setLoadingMap((prevLoadingMap) => ({
          ...prevLoadingMap,
          [commentId]: false, // Reset loading state for the current comment
        }));
      });
  };

  const handleDislike = (commentId) => {
    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [commentId]: true, // Set loading state for the current comment
    }));

    Axios.put(
      `${BASE_API_URL}/community/dislike-comment/${communityId}/${commentId}`,
      {},
      {
        headers: {
          Authorization: getTokenFromStore(),
        },
      }
    )
      .then((response) => {
        const { status } = response;
        if (status === 200) {
          updateCommentDislikes(commentId, userId);
        }
      })
      .catch(() => {
        // Handle error
      })
      .finally(() => {
        setLoadingMap((prevLoadingMap) => ({
          ...prevLoadingMap,
          [commentId]: false, // Reset loading state for the current comment
        }));
      });
  };

  const userHasLiked = (comment) => comment.likes.includes(userId);

  const userHasDisliked = (comment) => comment.dislikes.includes(userId);

  return (
    <div className="container-fluid pt-0 mb-5">
      {comments.map((comment, index) => (
        <div key={comment._id} className="row">
          <div className="col">
            <div
              className={`border rounded ${
                index === 0 ? 'no-border-top' : 'mt-5'
              }`}
            >
              <div className="d-flex">
                <div className="border-end">
                  <div className="p-4 m-150 text-center">
                    {/* Display user profile information */}
                    <OnlineImage
                      src={
                        comment.author?.vendor?.companyLogo ||
                        comment.author.profileImage
                      }
                      alt="Profile"
                      className="img-fluid rounded"
                      width="90"
                    />
                    <p className="mt-2 text-md mb-0">
                      {comment.author.firstName}
                    </p>
                    <p className="text-muted text-sm">
                      {DASHBOARD_PAGE[comment.author.role || 0]}
                    </p>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center text-muted">
                      <div className="d-flex">
                        <FaRegCalendarAlt />
                        <div className="text-md ms-1">
                          Posted on {getShortDate(comment.postedAt)}
                        </div>
                      </div>
                      <Dropdown>
                        <Dropdown.Toggle
                          as={CustomToggle}
                          id="dropdown-custom-components"
                        />

                        <Dropdown.Menu>
                          <Dropdown.Item eventKey="1">Reply</Dropdown.Item>
                          <Dropdown.Item eventKey="2">Share</Dropdown.Item>
                          <Dropdown.Item eventKey="2">
                            Report Comment
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <section className="mt-3">
                      <p className="mb-0">{comment.content}</p>
                    </section>
                  </div>

                  <div className="bg-light mt-3 p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="p-0">
                        <Button
                          color={
                            userHasLiked(comment)
                              ? 'secondary'
                              : 'primary-light'
                          }
                          className="me-2 btn-sm"
                          onClick={() => handleLike(comment._id)}
                          disabled={loadingMap[comment._id]}
                        >
                          <FaThumbsUp />{' '}
                          {userHasLiked(comment) ? 'Liked' : 'Like'}
                        </Button>
                        <Button
                          color={
                            userHasDisliked(comment)
                              ? 'danger'
                              : 'primary-light'
                          }
                          className={'btn-sm'}
                          onClick={() => handleDislike(comment._id)}
                          disabled={loadingMap[comment._id]}
                        >
                          <FaThumbsDown />{' '}
                          {userHasDisliked(comment) ? 'DisLiked' : 'DisLike'}
                        </Button>
                      </div>
                      <div className="d-flex mt-2 align-items-center">
                        {/* Render likes */}
                        <div className="text-md text-muted flex-grow-1">
                          <span className="text-danger me-1">
                            <IoIosHeart />
                          </span>
                          {comment.likes.length} likes
                        </div>
                      </div>
                      {/* Display loading spinner */}
                      {loadingMap[comment._id] && <BallersSpinner small />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunitySingle;
