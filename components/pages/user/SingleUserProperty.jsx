import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Modal from 'components/common/Modal';
import { useToast } from 'components/utils/Toast';
import { PortfolioIcon } from 'components/utils/Icons';
import { getLongDate } from 'utils/date-helpers';
import { VisitationIcon } from 'components/utils/Icons';
import { CancelVisitForm } from './ProcessVisitation';
import { RescheduleVisitForm } from './ProcessVisitation';
import { ScheduleVisitForm } from './ProcessVisitation';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { ProcessVasForm } from './ProcessVas';
import Button from 'components/forms/Button';
import { VAS_TYPE } from 'utils/constants';
import { useBoolean } from 'hooks/useBoolean';
import { FileIcon } from 'components/utils/Icons';
import { SearchIcon } from 'components/utils/Icons';
import { DoubleSpacing } from 'components/common/Helpers';
import { Spacing } from 'components/common/Helpers';
import { OwnedPropertyCard } from '@/components/shared/SingleProperty';
import { WelcomeHero } from 'pages/user/dashboard';
import { getLocationFromAddress } from '@/utils/helpers';

const pageOptions = {
  key: 'property',
  pageName: 'Property',
};

const SingleUserProperty = ({ id }) => {
  const [toast, setToast] = useToast();
  const [propertyQuery, property, setProperty] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneProperty(id),
    refresh: true,
  });

  const axiosOptionsForPropertyVas = {
    params: {
      limit: 0,
      type: VAS_TYPE.PROPERTY,
      sortBy: 'name',
      sortDirection: 'desc',
    },
  };

  const [vasQuery] = useGetQuery({
    axiosOptions: axiosOptionsForPropertyVas,
    key: 'vas',
    name: 'vas',
    setToast,
    endpoint: API_ENDPOINT.getAllVas(),
    refresh: true,
  });

  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!property}
        Icon={<PortfolioIcon />}
        query={propertyQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <WelcomeHero
          title={`${property?.name}`}
          subtitle={`${
            property?.address?.street1 &&
            getLocationFromAddress(property?.address)
          }`}
        />
        <OwnedPropertyCard
          property={property}
          setToast={setToast}
          setProperty={setProperty}
          enquiryInfo={property?.enquiryInfo}
          vendorInfo={property?.vendorInfo}
          Actionbar={
            <Actionbar
              property={property}
              visitationInfo={property?.visitationInfo}
              setToast={setToast}
              vasQuery={vasQuery}
            />
          }
        />
      </ContentLoader>
    </BackendPage>
  );
};

const Actionbar = ({ property, visitationInfo, setToast, vasQuery }) => {
  const userHasScheduledVisit =
    visitationInfo?.length > 0 &&
    visitationInfo?.[visitationInfo.length - 1].status === 'Pending';

  return (
    <section className="mt-3">
      <ViewTitleDocumentButton property={property} />
      <DoubleSpacing />
      <ScheduleTourButton
        property={property}
        visitationInfo={visitationInfo}
        setToast={setToast}
        userHasScheduledVisit={userHasScheduledVisit}
      />
      <DoubleSpacing />
      <InvestigatePropertyButton
        property={property}
        vasQuery={vasQuery}
        setToast={setToast}
      />

      <div className="mt-4">
        {userHasScheduledVisit && (
          <span className="alert alert-warning">
            Your visitation date is on{' '}
            <strong>
              {getLongDate(
                visitationInfo?.[visitationInfo.length - 1].visitDate
              )}
            </strong>
          </span>
        )}
      </div>
    </section>
  );
};

export const ViewTitleDocumentButton = ({ property }) => {
  const [showModal, setShowModalToTrue, setShowModalToFalse] =
    useBoolean(false);

  return (
    <>
      <Modal
        title="Title Document"
        show={showModal}
        onHide={setShowModalToFalse}
        showFooter={false}
      >
        <h3 className="mt-5">{property.titleDocument}</h3>

        <Button
          color="secondary"
          className="btn-wide btn-wide-sm btn-sm mb-5"
          onClick={setShowModalToFalse}
        >
          Request for Title Document
        </Button>
      </Modal>

      <Button
        color="none"
        className="btn-wide btn-wide-sm btn-sm btn-outline-secondary"
        onClick={setShowModalToTrue}
      >
        Request for Title Document
        <Spacing />
        <span className="icon-md">
          <FileIcon />
        </span>
      </Button>
    </>
  );
};

export const ScheduleTourButton = ({
  property,
  visitationInfo,
  setToast,
  userHasScheduledVisit,
}) => {
  const [showModal, setShowModalToTrue, setShowModalToFalse] = useBoolean();
  const [showReschedule, setShowReschedule] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const alreadyVisitedProperty = visitationInfo?.some(
    (visit) => visit.status === 'Resolved'
  );
  return (
    <>
      <Modal
        title="Schedula a Tour Today"
        show={showModal}
        onHide={setShowModalToFalse}
        showFooter={false}
      >
        {userHasScheduledVisit ? (
          <>
            {/* show cancel visitation */}
            {showCancelModal && (
              <>
                <h6>Cancel Modal Form</h6>

                <CancelVisitForm
                  visitationInfo={visitationInfo?.[visitationInfo.length - 1]}
                  hideForm={setShowModalToFalse}
                  setToast={setToast}
                />

                <div className="text-end">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="btn btn-danger btn-sm mt-5"
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {/* reschedule visitation */}
            {showReschedule && !showCancelModal && (
              <>
                <h6>Reschedule Form</h6>
                <RescheduleVisitForm
                  visitationInfo={visitationInfo?.[visitationInfo.length - 1]}
                  hideForm={setShowModalToFalse}
                  setToast={setToast}
                />
                <div className="text-end">
                  <button
                    onClick={() => setShowReschedule(false)}
                    className="btn btn-danger btn-sm mt-5"
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {/* show visitation information */}
            {!showReschedule && !showCancelModal && (
              <>
                <table className="table table-hover table-borderless">
                  <tbody>
                    <tr>
                      <td>Name </td>
                      <td>
                        {
                          visitationInfo?.[visitationInfo.length - 1]
                            .visitorName
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Email </td>
                      <td>
                        {
                          visitationInfo?.[visitationInfo.length - 1]
                            .visitorEmail
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Phone </td>
                      <td>
                        {
                          visitationInfo?.[visitationInfo.length - 1]
                            .visitorPhone
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Visit Date </td>
                      <td>
                        {getLongDate(
                          visitationInfo?.[visitationInfo.length - 1].visitDate
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  onClick={() => setShowReschedule(true)}
                  className="btn btn-sm btn-primary"
                >
                  Reschedule Visitation
                </button>
                &nbsp;&nbsp;
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn btn-sm btn-secondary"
                >
                  Cancel Visitation
                </button>
                &nbsp;&nbsp;
                <button
                  onClick={setShowModalToFalse}
                  className="btn btn-sm btn-danger"
                >
                  Close Modal
                </button>
              </>
            )}
          </>
        ) : (
          <ScheduleVisitForm
            hideForm={setShowModalToFalse}
            propertyId={property._id}
            setToast={setToast}
          />
        )}
      </Modal>
      <Button
        color="none"
        className="btn-wide btn-wide-sm btn-sm btn-outline-warning"
        onClick={setShowModalToTrue}
      >
        {alreadyVisitedProperty
          ? 'Schedule Another Visit'
          : 'Schedule a Tour Today'}
        <Spacing />
        <span className="icon-md">
          <VisitationIcon />
        </span>
      </Button>
    </>
  );
};

export const InvestigatePropertyButton = ({ property, setToast, vasQuery }) => {
  const [showModal, setShowModalToTrue, setShowModalToFalse] =
    useBoolean(false);

  return (
    <>
      <Modal
        title="Investigate Property"
        show={showModal}
        onHide={setShowModalToFalse}
        showFooter={false}
      >
        <ProcessVasForm
          hideForm={setShowModalToFalse}
          setToast={setToast}
          vasInfo={vasQuery.isLoading ? null : vasQuery?.data?.result}
          propertyId={property._id}
        />
      </Modal>

      <Button
        color="none"
        className="btn-wide btn-wide-sm btn-sm btn-outline-success"
        onClick={setShowModalToTrue}
      >
        Investigate Property
        <Spacing />
        <span className="icon-md">
          <SearchIcon />
        </span>
      </Button>
    </>
  );
};

export default SingleUserProperty;
