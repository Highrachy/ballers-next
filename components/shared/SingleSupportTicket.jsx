import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import CardTableSection from 'components/common/CardTableSection';
import { MessageIcon } from 'components/utils/Icons';
import WelcomeHero from 'components/common/WelcomeHero';
import { getDate } from '@/utils/date-helpers';
import { StatusBadge } from './SupportTicket';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError, statusIsSuccessful } from 'utils/helpers';
import Button from 'components/forms/Button';
import Textarea from 'components/forms/Textarea';
import { UserContext } from '@/context/UserContext';
import { BASE_API_URL, USER_ROLE } from '@/utils/constants';

const pageOptions = {
  key: 'supportTicket',
  pageName: 'Support Ticket',
};

const SingleSupportTicket = ({ id }) => {
  const [toast, setToast] = useToast();
  const [supportTicketQuery, supportTicket] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneSupportTicket(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <WelcomeHero
        title={supportTicket?.subject || 'Support Ticket'}
        subtitle="Details of your support request"
      />
      <ContentLoader
        hasContent={!!supportTicket}
        Icon={<MessageIcon />}
        query={supportTicketQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <SupportTicketDetail
          supportTicket={supportTicket}
          toast={toast}
          setToast={setToast}
        />
      </ContentLoader>
    </BackendPage>
  );
};

const SupportTicketDetail = ({ supportTicket, toast, setToast }) => {
  const { userState } = React.useContext(UserContext);
  const isAdmin = userState?.role === USER_ROLE.admin;
  const userInfo = supportTicket.userInfo?.[0];
  const anonymousUser = supportTicket.anonymousUser;
  const fullName = userInfo
    ? `${userInfo.firstName} ${userInfo.lastName} `
    : anonymousUser?.fullName;
  const email = userInfo ? userInfo.email : anonymousUser?.email;
  const phone = userInfo ? userInfo.phone : anonymousUser?.phone;

  return (
    <div className="container-fluid">
      <Toast {...toast} />
      <CardTableSection name="Support Ticket Information">
        <tr>
          <td>
            <strong>Subject</strong>
          </td>
          <td>{supportTicket?.subject}</td>
        </tr>

        {isAdmin && (
          <>
            <tr>
              <td>
                <strong>Full Name</strong>
              </td>
              <td>{fullName}</td>
            </tr>
            <tr>
              <td>
                <strong>Email</strong>
              </td>
              <td>{email}</td>
            </tr>
            <tr>
              <td>
                <strong>Phone</strong>
              </td>
              <td>{phone}</td>
            </tr>
            <tr>
              <td>
                <strong>Type</strong>
              </td>
              <td>{userInfo ? 'Registered User' : 'Anonymous User'}</td>
            </tr>
          </>
        )}
        <tr>
          <td>
            <strong>Description</strong>
          </td>
          <td>{supportTicket?.description}</td>
        </tr>
        <tr>
          <td>
            <strong>Status</strong>
          </td>
          <td>
            {' '}
            <StatusBadge status={supportTicket.status} />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Created At</strong>
          </td>
          <td>{getDate(supportTicket?.createdAt)}</td>
        </tr>
      </CardTableSection>
      {supportTicket?.comments?.length > 0 && (
        <CardTableSection name="Comments">
          {supportTicket?.comments?.map((comment, index) => (
            <tr
              className={
                comment?.user?.role === USER_ROLE.admin
                  ? 'bg-secondary-light'
                  : null
              }
              key={index}
            >
              <td>
                <strong>
                  {comment?.user?.firstName} {comment?.user?.lastName} -{' '}
                  {comment?.user?.role}
                </strong>
              </td>
              <td>{comment.comment}</td>
            </tr>
          ))}
        </CardTableSection>
      )}
      <CardTableSection name="Add Comment">
        <tr>
          <td>
            <AddCommentForm supportTicketId={supportTicket._id} />
          </td>
        </tr>
      </CardTableSection>
    </div>
  );
};

const commentSchema = Yup.object().shape({
  comment: Yup.string().required('Comment is required'),
});

const AddCommentForm = ({ supportTicketId, hideForm = () => {} }) => {
  const [toast, setToast] = useToast();

  return (
    <Formik
      initialValues={{ comment: '' }}
      validationSchema={commentSchema}
      onSubmit={(payload, actions) => {
        Axios({
          method: 'post',
          url: `${BASE_API_URL}/support/${supportTicketId}/add-comment`,
          data: payload,
          headers: { Authorization: getTokenFromStore() },
        })
          .then((response) => {
            const { status } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: 'Your comment has been successfully added.',
              });
              hideForm();
              actions.setSubmitting(false);
              actions.resetForm();
            }
          })
          .catch((error) => {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form>
          <section className="row">
            <div className="col-12">
              <Toast {...toast} />
              <Textarea label="Comment" name="comment" />
              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Add Comment
              </Button>
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
};

export default SingleSupportTicket;
