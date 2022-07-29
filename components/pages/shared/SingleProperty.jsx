import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Map from 'components/common/Map';
import { PROPERTY_VIDEO_STATUS, USER_TYPES } from 'utils/constants';
import { useToast } from 'components/utils/Toast';
import { moneyFormatInNaira, getLocationFromAddress } from 'utils/helpers';
import Image from 'components/utils/Image';
import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';
import { Link } from '@reach/router';
import { BathIcon } from 'components/utils/Icons';
import { ToiletIcon } from 'components/utils/Icons';
import { BedIcon } from 'components/utils/Icons';
import Humanize from 'humanize-plus';
import { CheckCircleIcon } from 'components/utils/Icons';
import { GalleryList } from './Gallery';
import { LinkSeparator } from 'components/common/Helpers';
import { useCurrentRole } from 'hooks/useUser';
import { TextSeparator } from 'components/common/Helpers';
import { Spacing } from 'components/common/Helpers';
import { FloorPlansList } from './FloorPlans';
import { AddFloorPlans } from './FloorPlans';
import { VideosList } from './Video';
import { AddVideos } from './Video';
import { AddNeighborhood } from './Neighborhood';
import { NeighborhoodList } from './Neighborhood';
import { useGetQuery } from 'hooks/useQuery';
import { PropertyIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import Button from 'components/forms/Button';
import { Form, Formik } from 'formik';
import Textarea from 'components/forms/Textarea';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import {
  reportPropertySchema,
  unflagPropertySchema,
  resolveFlagPropertySchema,
} from 'components/forms/schemas/propertySchema';
import Modal from 'components/common/Modal';
import { BASE_API_URL } from 'utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError, statusIsSuccessful } from 'utils/helpers';
import { SuccessIcon } from 'components/utils/Icons';
import { FlagProperty } from 'components/pages/admin/ReportedProperties';
import { getTinyDate } from 'utils/date-helpers';
import Tooltip from 'components/common/Tooltip';
import { ErrorIcon } from 'components/utils/Icons';
import { QuestionMarkIcon } from 'components/utils/Icons';
import { TestimonialsList } from './Testimonials';
import { AssignedPropertyIcon } from 'components/utils/Icons';
import { VendorIcon } from 'components/utils/Icons';

const pageOptions = {
  key: 'property',
  pageName: 'Property',
};

const SingleProperty = ({ id, Sidebar }) => {
  const [toast, setToast] = useToast();
  const [propertyQuery, property, setProperty] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneProperty(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!property}
        Icon={<PropertyIcon />}
        query={propertyQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <OwnedPropertyCard
          property={property}
          setToast={setToast}
          setProperty={setProperty}
          Sidebar={Sidebar}
        />
      </ContentLoader>
    </BackendPage>
  );
};

export const OwnedPropertyCard = ({
  property,
  setToast,
  setProperty,
  enquiryInfo,
  vendorInfo,
  Sidebar,
  Actionbar,
}) => {
  const isVendor = useCurrentRole().role === USER_TYPES.vendor;
  const isAdmin = useCurrentRole().role === USER_TYPES.admin;
  const isUser = useCurrentRole().role === USER_TYPES.user;
  const isAdminOrVendor = isVendor || isAdmin;
  return (
    <div className="container-fluid">
      {isVendor && false && (
        <div className="my-5 text-right">
          <Link
            className="btn btn-dark btn-wide"
            to={`/vendor/property/template/${property._id}`}
          >
            Create Property Template
          </Link>
        </div>
      )}

      <Card className="card-container mt-4 h-100 property-holder__big">
        <PropertyImage property={property} />

        {isAdminOrVendor && property?.flagged?.status && (
          <CaseComment
            flaggedCase={property?.flagged?.case[0]}
            isActive
            property={property}
            setToast={setToast}
            setProperty={setProperty}
          />
        )}

        {isVendor && (
          <ManagePropertyLink
            property={property}
            setToast={setToast}
            setProperty={setProperty}
          />
        )}

        <div className="row mt-5">
          <div className={Sidebar ? 'col-sm-7' : 'col-sm-12'}>
            <PropertyDescription
              property={property}
              enquiryInfo={enquiryInfo}
              vendorInfo={vendorInfo}
              Actionbar={Actionbar}
            />
          </div>
          {Sidebar && <div className="col-sm-5">{Sidebar}</div>}
        </div>

        <FloorPlansList
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />

        <NeighborhoodList
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />

        <TestimonialsList
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />

        <VideosList
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />
      </Card>

      <PropertyMap mapLocation={property.mapLocation} />

      {isUser && (
        <ReportProperty
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />
      )}

      {isAdmin && !property?.approved?.status && (
        <ApproveProperty
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />
      )}

      {isAdminOrVendor && (
        <CaseHistory
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />
      )}
    </div>
  );
};

const CaseComment = ({
  flaggedCase,
  isActive,
  property,
  setToast,
  setProperty,
}) => {
  const isVendor = useCurrentRole().role === USER_TYPES.vendor;
  const isAdmin = useCurrentRole().role === USER_TYPES.admin;
  return (
    <div className="mt-3">
      <div className="speech-bubble">
        <div className="d-flex align-items-center">
          <article className={isActive ? undefined : 'text-strike'}>
            {isActive ? (
              <h6 className="text-primary">{flaggedCase?.flaggedReason}</h6>
            ) : (
              <div>{flaggedCase?.flaggedReason}</div>
            )}

            {flaggedCase?.unflagRequestComment && (
              <div>{flaggedCase?.unflagRequestComment} </div>
            )}
            <small className="block-text-small">
              {getTinyDate(flaggedCase.flaggedDate)}
            </small>
          </article>

          {isActive && (
            <div className="ml-auto">
              {isAdmin && (
                <>
                  {flaggedCase?.unflagRequestComment && (
                    <>
                      <FlagProperty
                        property={property}
                        setToast={setToast}
                        repordId={null}
                        className={'btn btn-wide btn-xs btn-danger'}
                      />
                      <Spacing />
                    </>
                  )}
                  <UnflagProperty
                    caseId={flaggedCase._id}
                    property={property}
                    setToast={setToast}
                    setProperty={setProperty}
                  />
                </>
              )}
              {isVendor && (
                <ResolveFlaggedProperty
                  property={property}
                  setToast={setToast}
                  setProperty={setProperty}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CaseHistory = ({ property, setToast, setProperty }) => {
  return (
    <section className="mt-4">
      <>
        {property?.flagged?.case.length > 0 && (
          <h5 className="header-small my-5">Case History</h5>
        )}
        {property?.flagged?.case.map((flaggedCase, index) => (
          <CaseComment
            flaggedCase={flaggedCase}
            isActive={index === 0}
            property={property}
            setToast={setToast}
            setProperty={setProperty}
            key={index}
          />
        ))}
      </>

      {useCurrentRole().isAdmin && (
        <FlagProperty
          property={property}
          setToast={setToast}
          repordId={null}
          bigButton
        />
      )}
    </section>
  );
};

const ApproveProperty = ({ property, setToast, setProperty }) => {
  const [loading, setLoading] = React.useState(false);
  const [showApprovalModal, setShowApprovalModal] = React.useState(false);

  const approveProperty = () => {
    setLoading(true);
    Axios.put(
      `${BASE_API_URL}/property/approve/${property._id}`,
      {},
      {
        headers: { Authorization: getTokenFromStore() },
      }
    )
      .then(function (response) {
        const { status, data } = response;
        if (statusIsSuccessful(status)) {
          setToast({
            type: 'success',
            message: `The property has been successfully approved`,
          });
          setProperty(data.property);
          setLoading(false);
          setShowApprovalModal(false);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
      });
  };
  return (
    <div className="mt-5">
      <Button
        className="btn btn-success btn-wide"
        onClick={() => setShowApprovalModal(true)}
      >
        Approve Property
      </Button>

      {/* Approve Property Modals */}
      <Modal
        title="Verify Vendor"
        show={showApprovalModal}
        onHide={() => setShowApprovalModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <h5 className="my-2 confirmation-text">
              Are you sure you want to approve this property?
            </h5>
            <Button
              className="btn btn-secondary mb-5"
              onClick={approveProperty}
              loading={loading}
            >
              Approve Property
            </Button>
          </div>
        </section>
      </Modal>
    </div>
  );
};

const ResolveFlaggedProperty = ({ property, setToast, setProperty }) => {
  const [showUnflagModal, setShowUnflagModal] = React.useState(false);

  return (
    <>
      <Button
        className="btn btn-wide btn-xs btn-danger"
        onClick={() => setShowUnflagModal(true)}
      >
        Resolve Property
      </Button>

      <Modal
        title="Resolve Flag Property"
        show={showUnflagModal}
        onHide={() => setShowUnflagModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3">
            <Formik
              initialValues={setInitialValues(resolveFlagPropertySchema)}
              onSubmit={({ comment }, actions) => {
                const payload = {
                  propertyId: property._id,
                  comment,
                };
                Axios.post(
                  `${BASE_API_URL}/property/request-unflag`,
                  { ...payload },
                  {
                    headers: { Authorization: getTokenFromStore() },
                  }
                )
                  .then(function (response) {
                    const { status, data } = response;
                    if (statusIsSuccessful(status)) {
                      setToast({
                        type: 'success',
                        message: `Your request to unflag your property is successful`,
                      });
                      actions.setSubmitting(false);
                      actions.resetForm();
                      setShowUnflagModal(false);
                      setProperty(data.property);
                    }
                  })
                  .catch(function (error) {
                    setToast({
                      message: getError(error),
                    });
                    actions.setSubmitting(false);
                  });
              }}
              validationSchema={createSchema(resolveFlagPropertySchema)}
            >
              {({ isSubmitting, handleSubmit, ...props }) => (
                <Form>
                  <Textarea
                    name="comment"
                    label="Actions took to resolve issue"
                    placeholder="Request to Unflag Property"
                    rows="3"
                  />

                  <Button
                    className="btn-secondary mt-4"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Resolve Property
                  </Button>
                  <DisplayFormikState {...props} hide showAll />
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </Modal>
    </>
  );
};

const UnflagProperty = ({ property, setToast, setProperty, caseId }) => {
  const [showUnflagModal, setShowUnflagModal] = React.useState(false);

  return (
    <>
      <Button
        className="btn btn-wide btn-xs btn-secondary"
        onClick={() => setShowUnflagModal(true)}
      >
        UnFlag Property
      </Button>

      {/* UnFlag Property Modals */}
      <Modal
        title="Unflag Property"
        show={showUnflagModal}
        onHide={() => setShowUnflagModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3">
            <Formik
              initialValues={setInitialValues(unflagPropertySchema)}
              onSubmit={({ reason }, actions) => {
                const payload = {
                  propertyId: property._id,
                  reason,
                  caseId,
                };
                Axios.put(
                  `${BASE_API_URL}/property/unflag`,
                  { ...payload },
                  {
                    headers: { Authorization: getTokenFromStore() },
                  }
                )
                  .then(function (response) {
                    const { status, data } = response;
                    if (statusIsSuccessful(status)) {
                      setToast({
                        type: 'success',
                        message: `The property has been successfully unflagged`,
                      });
                      actions.setSubmitting(false);
                      actions.resetForm();
                      setShowUnflagModal(false);
                      setProperty(data.property);
                    }
                  })
                  .catch(function (error) {
                    setToast({
                      message: getError(error),
                    });
                    actions.setSubmitting(false);
                  });
              }}
              validationSchema={createSchema(unflagPropertySchema)}
            >
              {({ isSubmitting, handleSubmit, ...props }) => (
                <Form>
                  <Textarea
                    name="reason"
                    label="Reason for Unflaging"
                    placeholder="Unflag Property"
                    rows="3"
                  />

                  <Button
                    className="btn-secondary mt-4"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Unflag Property
                  </Button>
                  <DisplayFormikState {...props} hide showAll />
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </Modal>
    </>
  );
};

const ReportProperty = ({ property, setToast, setProperty }) => {
  const [showReportModal, setShowReportModal] = React.useState(false);

  return (
    <div className="text-right mt-5">
      <Button
        className="btn btn-xs btn-dark btn-wide"
        onClick={() => setShowReportModal(true)}
      >
        Report this Property
      </Button>

      {/* Report Property Modals */}
      <Modal
        title="Report Property"
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3">
            <Formik
              initialValues={setInitialValues(reportPropertySchema)}
              onSubmit={({ reason }, actions) => {
                Axios.post(
                  `${BASE_API_URL}/report-property`,
                  { propertyId: property._id, reason },
                  {
                    headers: { Authorization: getTokenFromStore() },
                  }
                )
                  .then(function (response) {
                    const { status } = response;
                    if (statusIsSuccessful(status)) {
                      setToast({
                        type: 'success',
                        message: `The property has been successfully reported`,
                      });
                      actions.setSubmitting(false);
                      actions.resetForm();
                      setShowReportModal(false);
                    }
                  })
                  .catch(function (error) {
                    setToast({
                      message: getError(error),
                    });
                    actions.setSubmitting(false);
                  });
              }}
              validationSchema={createSchema(reportPropertySchema)}
            >
              {({ isSubmitting, handleSubmit, ...props }) => (
                <Form>
                  <p>
                    <strong>Reason for Reporting</strong>
                  </p>
                  <Textarea
                    name="reason"
                    placeholder="Report Property"
                    rows="3"
                  />

                  <Button
                    className="btn-secondary mt-4"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Report Property
                  </Button>
                  <DisplayFormikState {...props} hide showAll />
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </Modal>
    </div>
  );
};

const ManagePropertyLink = ({ property, setToast, setProperty }) => (
  <section className="mt-3">
    <Link
      to={`/vendor/property/edit/${property._id}`}
      className="text-link text-muted"
    >
      Edit Property
    </Link>
    <LinkSeparator />
    <Link
      to={`/vendor/gallery/${property._id}`}
      className="text-link  text-muted"
    >
      {property?.gallery?.length > 0 ? 'Edit Gallery' : 'Add Gallery'}
    </Link>
    <LinkSeparator />
    <AddVideos
      className="text-link text-muted"
      property={property}
      setToast={setToast}
      setProperty={setProperty}
    />
    <LinkSeparator />
    <AddFloorPlans
      className="text-link text-muted"
      property={property}
      setToast={setToast}
      setProperty={setProperty}
    />
    <LinkSeparator />
    <AddNeighborhood
      className="text-link text-muted"
      property={property}
      setToast={setToast}
      setProperty={setProperty}
    />
  </section>
);

export const PropertyImage = ({ property, hideGallery }) => {
  const showGallery = property?.gallery?.length > 0 && !hideGallery;
  return (
    <>
      <div className="row">
        <div className={!showGallery ? 'col-sm-12' : 'col-sm-10'}>
          <div
            className={
              !useCurrentRole().isUser && property?.flagged?.status
                ? 'overlay overlay__danger'
                : undefined
            }
          >
            <Image
              defaultImage={PropertyPlaceholderImage}
              src={property.mainImage}
              name="Property Image"
              className="img-fluid gallery-main-image property-img"
              watermark
            />
          </div>
        </div>
        {showGallery && <GalleryList property={property} />}
      </div>
    </>
  );
};

export const PropertyDescription = ({
  property,
  isPortfolioPage,
  enquiryInfo,
  vendorInfo,
  Actionbar,
}) => {
  const [showDescription, setShowDescription] = React.useState(false);
  const DESCRIPTION_LENGTH = 600;
  const hideSomePropertyDescription =
    !showDescription && property.description.length > DESCRIPTION_LENGTH;

  return (
    <>
      <PropertyHeader
        property={property}
        enquiryInfo={enquiryInfo}
        vendorInfo={vendorInfo}
      />

      <h5 className="mt-5 header-smaller">About Property</h5>
      <div className="position-relative">
        {hideSomePropertyDescription
          ? Humanize.truncate(property.description, DESCRIPTION_LENGTH, '...')
          : property.description}
        {hideSomePropertyDescription && (
          <div className="show-more-holder">
            <button
              className="btn btn-xs btn-dark btn-wide show-more-button"
              onClick={() => setShowDescription(true)}
            >
              Show All
            </button>
          </div>
        )}
      </div>

      {/* action bar */}
      <section className="actionbar">{Actionbar}</section>

      <h5 className="mt-5 header-smaller">Features</h5>
      <ul className="list-unstyled row lh-2">
        {property.features?.map((feature, index) => (
          <li className="col-sm-6" key={index}>
            <span className="text-secondary">
              <CheckCircleIcon /> &nbsp;
            </span>
            {feature}
          </li>
        ))}
      </ul>
      {useCurrentRole().role !== USER_TYPES.vendor && !isPortfolioPage && (
        <div className="my-5">
          <div className="hero-holder">
            <h5 className="text-primary header-smaller">Important Notice</h5>
            <ol className="ml-n3">
              <li>
                Do not make any upfront payment as inspection fee when visiting
                the property.
              </li>
              <li>
                When you find a property of your interest, make sure you ask
                appropriate questions before accepting your offer.
              </li>
              <li>
                All meetings with agents should be done in open locations.
              </li>
              <li>
                The agent is not a representative from Baller.ng neither does
                Baller.ng control the affairs of the agent as both parties are
                different entities.
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
};

export const PropertyHeader = ({ property, enquiryInfo, vendorInfo }) => {
  const userHasPreviousEnquiry = !!enquiryInfo;
  const isUser = useCurrentRole().isUser;
  return (
    <>
      <div className="row mb-3">
        <div className="col-sm-8">
          <h3 className="property-holder__big-title">
            {property.name}{' '}
            {!isUser && <ShowPropertyStatus property={property} />}
          </h3>
        </div>
        <div className="col-sm-4 text-right">
          <Link
            className="text-muted"
            to={`/vendors/${vendorInfo?.vendor?.slug}`}
          >
            <VendorIcon /> {vendorInfo?.vendor?.companyName}
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-8">
          <h4 className="text-secondary mb-3">
            {moneyFormatInNaira(property.price)}
          </h4>
        </div>
        <div className="col-sm-4 text-right">
          {isUser && (
            <>
              {(enquiryInfo?.approved || !userHasPreviousEnquiry) && (
                <Link
                  to={`/user/property/enquiry/${property._id}`}
                  className="btn btn-sm btn-wide btn-secondary"
                >
                  {userHasPreviousEnquiry ? 'Buy Property Again' : 'Buy Now'}
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      <p className="mb-2 text-muted">
        {getLocationFromAddress(property.address)}
      </p>
      <div className="property-info-details">
        <span className="pr-3">
          <BedIcon /> <Spacing /> {property.bedrooms}{' '}
          {Humanize.pluralize(property.bedrooms, 'bed')}
        </span>
        <TextSeparator />
        <span className="px-3">
          <BathIcon /> <Spacing /> {property.bathrooms}{' '}
          {Humanize.pluralize(property.bathrooms, 'bath')}
        </span>
        <TextSeparator />
        <span className="px-3">
          <ToiletIcon /> <Spacing /> {property.toilets}{' '}
          {Humanize.pluralize(property.toilets, 'toilet')}
        </span>
        <TextSeparator />
        <span className="pl-3">
          <AssignedPropertyIcon /> <Spacing /> {property.availableUnits}{' '}
          {Humanize.pluralize(property.availableUnits, 'unit')}
        </span>
      </div>
    </>
  );
};

export const ShowPropertyStatus = ({ property }) => {
  return (
    <>
      {property?.status === PROPERTY_VIDEO_STATUS.APPROVED && (
        <small className="text-success">
          <Spacing />
          <Tooltip text="Approved">
            <SuccessIcon />
          </Tooltip>{' '}
        </small>
      )}
      {property?.status === PROPERTY_VIDEO_STATUS.DISAPPROVED && (
        <small className="text-success">
          <Spacing />
          <Tooltip text="Disapproved">
            <ErrorIcon />
          </Tooltip>{' '}
        </small>
      )}
      {property?.status === PROPERTY_VIDEO_STATUS.PENDING_ADMIN_REVIEW && (
        <small className="text-success">
          <Spacing />
          <Tooltip text="Pending Admin Review">
            <QuestionMarkIcon />
          </Tooltip>
        </small>
      )}
    </>
  );
};

export const PropertyMap = ({ mapLocation }) =>
  mapLocation ? (
    mapLocation.latitude &&
    mapLocation.longitude && (
      <div style={{ height: '15rem', marginTop: '-2px' }}>
        <Map
          coordinates={{
            lat: mapLocation.latitude,
            lng: mapLocation.longitude,
          }}
        />
      </div>
    )
  ) : (
    <></>
  );

export default SingleProperty;
