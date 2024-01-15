import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Map from 'components/common/Map';
import {
  PRICING_MODEL,
  PRICING_MODEL_DESC,
  PROPERTY_VIDEO_STATUS,
  USER_TYPES,
} from 'utils/constants';
import { useToast } from 'components/utils/Toast';
import { moneyFormatInNaira, getLocationFromAddress } from 'utils/helpers';
import Image, { OnlineImage } from 'components/utils/Image';
import PropertyPlaceholderImage from 'assets/img/placeholder/property.png';
import Link from 'next/link';
import {
  BathIcon,
  DeliveryStateIcon,
  FileIcon,
  MapPinIcon,
  TransactionIcon,
  VendorIcon,
  VisitationIcon,
} from 'components/utils/Icons';
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
import { useRouter } from 'next/router';
import { BiGitCompare } from 'react-icons/bi';
import WelcomeHero from '../common/WelcomeHero';
import {
  AddPropertyUpdatesCategory,
  PropertyUpdatesList,
} from './PropertyUpdate';
import { MilestonePaymentList } from './MilestonePayment';
import ReactMarkdown from 'react-markdown';
import { isMilestonePayment } from '@/utils/milestone-helper';
import { CallCalling, MessageText1, Whatsapp } from 'iconsax-react';
import colorTokens from 'style-dictionary/build/color.tokens';

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
          Sidebar={Sidebar}
        />
      </ContentLoader>
    </BackendPage>
  );
};

export const OwnedPropertyCard = ({
  property,
  setToast,
  setProperty = () => {},
  enquiryInfo,
  vendorInfo,
  Sidebar,
  isPortfolioPage,
  Actionbar,
}) => {
  const isVendor = useCurrentRole().role === USER_TYPES.vendor;
  const isAdmin = useCurrentRole().role === USER_TYPES.admin;
  const isUser = useCurrentRole().role === USER_TYPES.user;
  const isAdminOrVendor = isVendor || isAdmin;
  return (
    <div className="container-fluid">
      {isVendor && false && (
        <div className="my-5 text-end">
          <Link
            className="btn btn-dark btn-wide"
            href={`/vendor/property/template/${property._id}`}
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

        <div className="mt-4">
          <PropertyHeader
            property={property}
            enquiryInfo={enquiryInfo}
            vendorInfo={vendorInfo}
            isPortfolioPage={isPortfolioPage}
          />
          <div className={Sidebar ? 'col-sm-7' : 'col-sm-12'}>
            <PropertyDescription
              property={property}
              enquiryInfo={enquiryInfo}
              vendorInfo={vendorInfo}
              Actionbar={Actionbar}
              isPortfolioPage={isPortfolioPage}
            />
          </div>
          {Sidebar && <div className="col-sm-5">{Sidebar}</div>}
        </div>
        <PropertyLists
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

export const PropertyLists = ({
  property,
  setToast,
  setProperty,
  isPublicPage,
}) => (
  <>
    {isMilestonePayment(property) && (
      <MilestonePaymentList
        property={property}
        setToast={setToast}
        setProperty={setProperty}
        isPublicPage={isPublicPage}
      />
    )}

    <PropertyUpdatesList
      property={property}
      setToast={setToast}
      setProperty={setProperty}
      isPublicPage={isPublicPage}
    />

    <FloorPlansList
      property={property}
      setToast={setToast}
      setProperty={setProperty}
      isPublicPage={isPublicPage}
    />

    <NeighborhoodList
      property={property}
      setToast={setToast}
      setProperty={setProperty}
      isPublicPage={isPublicPage}
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
      isPublicPage={isPublicPage}
    />
  </>
);

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
            <div className="ms-auto">
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
    <div className="text-end mt-5">
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
    <Link href={`/properties/${property.slug}`} passHref>
      <a
        className="text-link text-muted"
        target="_blank"
        rel="noopener noreferrer"
      >
        View as User
      </a>
    </Link>
    <LinkSeparator />
    <Link href={`/vendor/property/new/${property._id}`}>
      <a className="text-link text-muted">Edit Property</a>
    </Link>
    <LinkSeparator />
    <Link href={`/vendor/property/gallery/${property._id}`}>
      <a className="text-link text-muted">
        {property?.gallery?.length > 0 ? 'Edit Gallery' : 'Add Gallery'}
      </a>
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
    {!isMilestonePayment(property) && <LinkSeparator />}
    <AddPropertyUpdatesCategory
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
    <section className="property-image-wrapper">
      <div className="row gx-2">
        <div className={!showGallery ? 'col-lg-12' : 'col-lg-10'}>
          <div
            className={
              !useCurrentRole().isUser && property?.flagged?.status
                ? 'overlay overlay__danger'
                : 'hover-image d-block'
            }
          >
            <OnlineImage
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
    </section>
  );
};

const ContactOption = ({ icon, header, text, link }) => {
  return (
    <div className="col-md-4">
      <Link href={link}>
        <a className="contact-link">
          <p className="mb-2 text-uppercase fw-bold">{text}</p>
          <h5 className="mt-0 mb-2 fw-bold">
            {icon} {header}
          </h5>
        </a>
      </Link>
    </div>
  );
};

const PropertyContact = () => {
  return (
    <div className="property-contact mt-5">
      <div className="row">
        <div className="col-md-12 interested-contact">
          <h4 className="text-primary-light mt-0 mb-5">
            Interested in this property?
          </h4>
        </div>
      </div>
      <div className="row">
        <ContactOption
          icon={
            <CallCalling
              size="32"
              color={colorTokens.primary[200]}
              variant="Bold"
            />
          }
          text="CALL US NOW"
          header="+2348076545543"
          link="#"
        />
        <ContactOption
          icon={
            <Whatsapp
              size="32"
              color={colorTokens.primary[200]}
              variant="Bold"
            />
          }
          header="+2348076545543"
          text="CHAT VIA WHATSAPP"
          link="#"
        />
        <ContactOption
          icon={
            <MessageText1
              size="32"
              color={colorTokens.primary[200]}
              variant="Bold"
            />
          }
          text="Contact Us"
          header="info@ballers.ng"
          link="#"
        />
      </div>
    </div>
  );
};

export const PropertyDescription = ({
  property,
  isPortfolioPage,
  isPublicPage,
  Actionbar,
}) => {
  const [showDescription, setShowDescription] = React.useState(false);
  const [showSafetyTips, setShowSafetyTips] = React.useState(false);
  const DESCRIPTION_LENGTH = 600;
  const hideSomePropertyDescription =
    !showDescription && property.description.length > DESCRIPTION_LENGTH;

  const { asPath } = useRouter();

  const propertyDetails = [
    {
      title: 'Property Type',
      value: property?.houseType,
      Icon: PropertyIcon,
    },
    {
      title: 'Bedroom',
      value: `${property.bedrooms} ${Humanize.pluralize(
        property.bedrooms,
        'bed'
      )}`,
      Icon: BedIcon,
    },
    {
      title: 'Bathrooms',
      value: `${property.bathrooms} ${Humanize.pluralize(
        property.bathrooms,
        'bath'
      )}`,
      Icon: BathIcon,
    },
    {
      title: 'Toilets',
      value: `${property.toilets} ${Humanize.pluralize(
        property.toilets,
        'toilet'
      )}`,
      Icon: ToiletIcon,
    },
    {
      title: 'Title Document',
      value: property?.titleDocument || 'No Title Document',
      Icon: FileIcon,
    },
    {
      title: 'Available Units',
      value: `${property.availableUnits} ${Humanize.pluralize(
        property.availableUnits,
        'unit'
      )}`,
      Icon: AssignedPropertyIcon,
    },
    {
      title: 'Project Start Date',
      value: property?.projectStartDate
        ? getTinyDate(property?.projectStartDate)
        : null || 'Not Specified',
      Icon: VisitationIcon,
    },
    {
      title: 'Delivery State',
      value: property?.deliveryState || 'Finished State',
      Icon: DeliveryStateIcon,
    },
    {
      title: 'Price',
      value: moneyFormatInNaira(property?.price),
      Icon: TransactionIcon,
    },
    {
      title: 'Pricing Model',
      value: property?.pricingModel
        ? PRICING_MODEL_DESC[property?.pricingModel]
        : property?.pricingModel || 'Timeline',
      Icon: TransactionIcon,
    },
  ];

  const currentRole = useCurrentRole();

  return (
    <>
      <h5 className="mt-5 header-content">About Property</h5>

      <div className="position-relative">
        <ReactMarkdown>
          {hideSomePropertyDescription
            ? Humanize.truncate(property.description, DESCRIPTION_LENGTH, '...')
            : property.description}
        </ReactMarkdown>
        {hideSomePropertyDescription && (
          <>
            <div className="show-more-holder" />
            <span
              className="show-more-button"
              onClick={() => setShowDescription(true)}
            >
              Show All
            </span>
          </>
        )}
      </div>

      <h5 className="header-content">Property Details</h5>
      <ul className="list-unstyled row lh-2">
        {propertyDetails.map(({ title, value, Icon }, index) => (
          <PropertyDetailsList
            key={index}
            title={title}
            value={value}
            Icon={Icon}
          />
        ))}
      </ul>

      <h5 className="header-content">Features</h5>
      <ul className="list-unstyled row lh-2">
        {property.features?.map((feature, index) => (
          <li
            className={isPublicPage ? 'col-sm-6 col-lg-4' : 'col-sm-6'}
            key={index}
          >
            <span className="text-secondary">
              <CheckCircleIcon /> &nbsp;
            </span>
            <span className="text-primary-light">{feature}</span>
          </li>
        ))}
      </ul>
      <section className="actionbar">{Actionbar}</section>
      {isPublicPage && <PropertyContact />}

      {(isPublicPage ||
        (currentRole?.role !== USER_TYPES.vendor && !isPortfolioPage)) && (
        <div className="warning-alert my-5">
          <h5 className="header-smaller">Safety Tips</h5>
          <ol className="ms-n3 mb-0">
            <li>
              Do not make any upfront payment as inspection fee when visiting
              the property.
            </li>

            <li>
              When you find a property of your interest, make sure you ask
              appropriate questions before accepting your offer.
            </li>
            {showSafetyTips && (
              <>
                <li>
                  All meetings with agents should be done in open locations.
                </li>
                <li>
                  The agent is not a representative from Baller.ng neither does
                  Baller.ng control the affairs of the agent as both parties are
                  different entities.
                </li>
              </>
            )}

            {!showSafetyTips && (
              <span
                className="show-more-button warning"
                onClick={() => setShowSafetyTips(true)}
              >
                Show All
              </span>
            )}
          </ol>
        </div>
      )}
    </>
  );
};

export const PropertyDetailsList = ({ title, Icon, value }) => (
  <li className="col-lg-6 d-flex align-items-center  mt-4">
    <span className="text-primary-light fw-bold me-2 lh-0 flex-shrink-0 w-150">
      {title}:
    </span>
    <span className="flex-grow-1 lh-0 text-primary-light">{value}</span>
  </li>
);

export const ComparePropertyButton = ({ property }) => (
  <Link href={`/compare-properties/${property?.slug}`} passHref>
    <a className="btn btn-secondary-light btn-wide btn-wide-sm btn-sm">
      Compare with Another Property <BiGitCompare />
    </a>
  </Link>
);

export const ViewVendorButton = ({ property }) => (
  <Link href={`/vendors/${property?.vendorInfo?.vendor?.slug}`}>
    <a className="btn btn-primary-light btn-wide btn-wide-sm btn-sm">
      View BALL VIP Information <VendorIcon />
      {/* {vendorInfo?.vendor?.companyName} */}
    </a>
  </Link>
);

export const PropertyHeader = ({
  property,
  enquiryInfo,
  vendorInfo,
  isPortfolioPage,
  actionButton = null,
}) => {
  const userHasPreviousEnquiry = !!enquiryInfo;
  const isUser = useCurrentRole().isUser;
  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <h2 className="property-holder__big-title">
            {property.name}{' '}
            {/* {!isUser && <ShowPropertyStatus property={property} />} */}
          </h2>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <h3 className="text-secondary mb-2">
            {moneyFormatInNaira(property.price)}
          </h3>
        </div>
        <div className="col-sm-6 text-end">
          {actionButton ||
            (isUser && !isPortfolioPage && (
              <>
                {(enquiryInfo?.approved || !userHasPreviousEnquiry) && (
                  <Link
                    href={`/user/property/enquiry/${property._id}`}
                    passHref
                  >
                    <a className="btn btn-sm btn-wide btn-secondary">
                      {userHasPreviousEnquiry
                        ? 'Buy Property Again'
                        : 'Buy Now'}
                    </a>
                  </Link>
                )}
              </>
            ))}
        </div>
      </div>

      <div className="mb-2 text-muted">
        <MapPinIcon /> {getLocationFromAddress(property.address)}
      </div>
      <div className="property-info-details mb-4">
        <span className="pe-3">
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
        <span className="ps-3">
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

export const PropertyMap = ({ mapLocation }) => <></>;
// mapLocation ? (
//   mapLocation.latitude &&
//   mapLocation.longitude && (
//     <div style={{ height: '15rem', marginTop: '-2px' }}>
//       <Map
//         coordinates={{
//           lat: mapLocation.latitude,
//           lng: mapLocation.longitude,
//         }}
//       />
//     </div>
//   )
// ) : (
//   <></>
// );

export default SingleProperty;
