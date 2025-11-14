import CommunityGallery from '@/components/common/CommunityGallery';
import TitleSection from '@/components/common/TitleSection';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { BiComment } from 'react-icons/bi';
import { Eye, Message } from 'iconsax-react';
import { TiPin } from 'react-icons/ti';
import { Pagination } from 'react-bootstrap';
import { API_ENDPOINT } from '@/utils/URL';
import Axios from 'axios';
import Link from 'next/link';
import { getShortDate } from '@/utils/date-helpers';
import { OnlineImage } from '@/components/utils/Image';
import Button from '@/components/forms/Button';
import SeoHead from '@/components/utils/SeoHead';

const Community = ({ result, pagination }) => {
  return (
    <>
      <SeoHead
        title="BALL Community Forum | Topics, Discussions and Real Estate Insights"
        description="Join the BALL community to discuss real estate, homeownership, investment tips and vendor insights. Explore active topics and share knowledge with fellow BALLers."
        canonical="https://ballers.ng/community"
        ogImage="https://www.ballers.ng/img/pages/ball-refer.png"
        keywords={[
          'ball community',
          'real estate forum nigeria',
          'property discussions',
          'homeownership forum',
          'ballers community',
          'sell property nigeria',
          'buy property nigeria',
          'real estate advice',
        ]}
      />

      {/* Hidden helper text for SEO */}
      <p className="visually-hidden">
        The BALL community is a real estate discussion forum for homebuyers,
        investors and property vendors. Users can browse topics, view replies
        and engage in conversations about homeownership and property sales.
      </p>
      <Header />
      <TitleSection
        name="BALL Community"
        content="Join BALL's vibrant community for homeownership success."
      />
      <ForumHeading />
      {result && <ForumTable topics={result} />}
      <CommunityGallery />
      <Footer />
    </>
  );
};

const ForumHeading = () => {
  return (
    <div className="container-fluid">
      <section className="row mt-5">
        <div className="col-12 text-end">
          <Button color="secondary" href="/community/new">
            + Add a New Topic
          </Button>
        </div>
      </section>
    </div>
  );
};

const ForumTable = ({ topics }) => {
  return (
    <div className="container-fluid">
      <div className="table-responsive">
        <table className="table table-bordered table-hover mb-0">
          <thead>
            <tr>
              <th width="50%">
                <p className="text-md fw-bold text-muted mb-0">Topic</p>
              </th>
              <th className="text-center" width="15%">
                <p className="text-md fw-bold text-muted mb-0">
                  <Eye />
                </p>
              </th>
              <th className="text-center" width="10%">
                <p className="text-md fw-bold text-muted mb-0">
                  <Message />
                </p>
              </th>
              <th>
                <p className="text-md fw-bold text-muted mb-0 text-end">
                  Last Posted
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic, index) => {
              const authorComment = topic?.comments[0];
              const author = authorComment?.author;
              const lastComment = topic?.comments[topic?.comments.length - 1];
              const lastCommentAuthor = lastComment?.author;
              return (
                <Link href={`/community/${topic?.slug}`} key={index}>
                  <tr key={index}>
                    <td>
                      <h5>
                        <TiPin />
                        {topic.title}
                        <span className="ms-2 badge rounded-pill text-bg-primary community__category-badge ">
                          {topic.category}
                        </span>
                      </h5>
                      <p className="mb-0">
                        <OnlineImage
                          src={
                            author?.vendor?.companyLogo || author?.profileImage
                          }
                          alt={author?.firstName + ' ' + author?.lastName}
                          className="rounded ms-3 img-contain"
                          style={{ width: '20px', height: '20px' }}
                        />{' '}
                        {author?.firstName} {author?.lastName} .
                        <span className="text-muted ms-2">
                          {getShortDate(authorComment.postedAt)}
                        </span>
                      </p>
                    </td>
                    <td className="text-center">
                      <h6>{topic.views}</h6>
                      <p className="text-muted">Views</p>
                    </td>
                    <td className="text-center">
                      <h6>{topic.comments.length}</h6>
                      <p className="text-muted">Replies</p>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-content-end">
                        <div className="text-end">
                          <p className="mb-0">
                            by{' '}
                            {lastCommentAuthor?.firstName +
                              ' ' +
                              lastCommentAuthor?.lastName}
                          </p>
                          <p className="text-muted mb-0">
                            on {getShortDate(lastComment.postedAt)}
                          </p>
                        </div>
                        <OnlineImage
                          src={
                            lastCommentAuthor?.vendor?.companyLogo ||
                            lastCommentAuthor?.profileImage
                          }
                          alt={
                            lastCommentAuthor?.firstName +
                            ' ' +
                            lastCommentAuthor?.lastName
                          }
                          className="rounded ms-3 img-contain"
                          style={{ width: '40px', height: '40px' }}
                        />
                      </div>
                    </td>
                  </tr>
                </Link>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item>{pagination.currentPage}</Pagination.Item>
          <Pagination.Ellipsis />
          <Pagination.Item>{pagination.totalPage}</Pagination.Item>
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </div> */}
    </div>
  );
};

export async function getStaticProps() {
  try {
    const { data } = await Axios.get(API_ENDPOINT.getAllCommunityTopics());
    console.log('data', data);
    return {
      props: {
        ...data,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching community topics:', error);
    return {
      props: {
        result: [],
        pagination: {
          currentPage: 1,
          limit: 10,
          offset: 0,
          total: 0,
          totalPage: 1,
        },
      },
      revalidate: 10,
    };
  }
}

export default Community;
