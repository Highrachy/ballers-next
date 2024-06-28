import React, { useContext } from 'react';
import { Badge, Card } from 'react-bootstrap';
import BackendPage from 'components/layout/BackendPage';
import PaginatedContent from 'components/common/PaginatedContent';
import Modal from 'components/common/Modal';
import Toast, { useToast } from 'components/utils/Toast';
import Axios from 'axios';
import {
  setInitialValues,
  DisplayFormikState,
} from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { Formik, Form } from 'formik';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  BASE_API_URL,
  DASHBOARD_PAGE,
  SUPPORT_TICKET_STATUS,
} from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { addSupportTicketSchema } from 'components/forms/schemas/supportTicketSchema';
import { getError, statusIsSuccessful, valuesToOptions } from 'utils/helpers';
import Input from 'components/forms/Input';
import { refreshQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from '@/utils/URL';
import Textarea from '../forms/Textarea';
import { UserContext } from '@/context/UserContext';
import { addAnonymousSupportTicketSchema } from '../forms/schemas/supportTicketSchema';
import { getDate } from '@/utils/date-helpers';

export const SupportTicketForm = ({
  hideForm = () => {},
  supportTicket = {},
  buttonText = '',
  page = '',
}) => {
  const [toast, setToast] = useToast();
  const { userState } = useContext(UserContext);
  const userHasLoggedIn = userState?.isLoggedIn;
  const id = supportTicket?._id || null;
  const currentSchema = userHasLoggedIn
    ? addSupportTicketSchema
    : addAnonymousSupportTicketSchema;
  return (
    <Formik
      enableReinitialize={true}
      initialValues={setInitialValues(currentSchema, {
        priority: 'medium',
        ...supportTicket,
      })}
      onSubmit={(payload, actions) => {
        Axios({
          method: id ? 'put' : 'post',
          url: id ? `${BASE_API_URL}/support/${id}` : `${BASE_API_URL}/support`,
          data: { ...payload, page },
          headers: { Authorization: getTokenFromStore() },
        })
          .then(function (response) {
            const { status } = response;
            if (statusIsSuccessful(status)) {
              setToast({
                type: 'success',
                message: `Your support ticket has been successfully ${
                  id ? 'updated' : 'created. We will get back to you shortly.'
                }`,
              });
              hideForm();
              refreshQuery('supportTicket', true);
              actions.setSubmitting(false);
              actions.resetForm();
            }
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(currentSchema)}
    >
      {({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <section className="row">
            <div className="col-12">
              <Toast {...toast} />
              {!userHasLoggedIn && (
                <>
                  <Input label="Full Name" name="anonymousUser.fullName" />
                  <Input label="Email" name="anonymousUser.email" />
                  <Input label="Phone" name="anonymousUser.phone" optional />
                </>
              )}
              <Input label="Subject" name="subject" />
              <Textarea label="Description" name="description" />
              <Button
                className="btn-secondary mt-4"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                {buttonText
                  ? buttonText
                  : id
                  ? 'Update Support Ticket'
                  : 'Add Support Ticket'}
              </Button>
              <DisplayFormikState {...props} showAll />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
};

const SupportTickets = () => {
  const [showAddSupportTicketModal, setShowAddSupportTicketModal] =
    React.useState(false);

  return (
    <BackendPage>
      <PaginatedContent
        addNewUrl={() => setShowAddSupportTicketModal(true)}
        endpoint={API_ENDPOINT.getAllSupportTickets()}
        pageName="Support Ticket"
        DataComponent={SupportTicketsRowList}
        PageIcon={<i className="fa fa-ticket" />} // replace with appropriate icon if available
        queryName="supportTicket"
      />

      <Modal
        title="Support Ticket"
        show={showAddSupportTicketModal}
        onHide={() => setShowAddSupportTicketModal(false)}
        showFooter={false}
      >
        <SupportTicketForm
          hideForm={() => setShowAddSupportTicketModal(false)}
        />
      </Modal>
    </BackendPage>
  );
};

const SupportTicketsRowList = ({ results, offset, setToast }) => {
  const [showEditSupportTicketModal, setShowEditSupportTicketModal] =
    React.useState(false);
  const [supportTicket, setSupportTicket] = React.useState(null);

  return (
    <div className="container-fluid">
      <Card className="mt-2">
        <div className="table-responsive">
          <table className="table table-border table-hover">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Created At</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {results.map((ticket, index) => (
                <SupportTicketsRow
                  key={index}
                  number={offset + index + 1}
                  supportTicket={ticket}
                  setSupportTicket={setSupportTicket}
                  setShowEditSupportTicketModal={setShowEditSupportTicketModal}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal
        title="Edit Support Ticket"
        show={showEditSupportTicketModal}
        onHide={() => setShowEditSupportTicketModal(false)}
        showFooter={false}
      >
        <SupportTicketForm
          hideForm={() => setShowEditSupportTicketModal(false)}
          setToast={setToast}
          supportTicket={supportTicket}
        />
      </Modal>
    </div>
  );
};

const SupportTicketsRow = ({
  supportTicket,
  number,
  setSupportTicket,
  setShowEditSupportTicketModal,
}) => {
  const { userState } = React.useContext(UserContext);
  const userInfo = supportTicket.userInfo?.[0];
  const anonymousUser = supportTicket.anonymousUser;
  const fullName = userInfo
    ? `${userInfo.firstName} ${userInfo.lastName} `
    : anonymousUser?.fullName;
  return (
    <tr>
      <td>{number}</td>
      <td>{fullName}</td>
      <td>{supportTicket.subject}</td>
      <td>
        <StatusBadge status={supportTicket.status} />
      </td>
      <td>{getDate(supportTicket.createdAt)}</td>
      <td>
        <p className="my-3">
          <Button
            color="info-light"
            className="btn btn-xs btn-wide me-3"
            onClick={() => {
              setSupportTicket(supportTicket);
              setShowEditSupportTicketModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            color="secondary-light"
            className="btn btn-xs btn-wide"
            href={`/${DASHBOARD_PAGE[userState?.role]}/support-ticket/${
              supportTicket._id
            }`}
          >
            View
          </Button>
        </p>
      </td>
    </tr>
  );
};

const statusColorMap = {
  [SUPPORT_TICKET_STATUS.NEW]: 'primary',
  [SUPPORT_TICKET_STATUS.OPEN]: 'info',
  [SUPPORT_TICKET_STATUS.PENDING]: 'warning',
  [SUPPORT_TICKET_STATUS.ON_HOLD]: 'secondary',
  [SUPPORT_TICKET_STATUS.SOLVED]: 'success',
  [SUPPORT_TICKET_STATUS.CLOSED]: 'dark',
};

export const StatusBadge = ({ status }) => {
  const color = statusColorMap[status] || 'secondary';
  return (
    <Badge bg={color} className="text-capitalize">
      {status}
    </Badge>
  );
};

export default SupportTickets;
