import React, { useEffect, useState } from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card, Col, Row, Table } from 'react-bootstrap';
import Map from 'components/common/Map';
import {
  PRICING_MODEL,
  PRICING_MODEL_DESC,
  PROPERTY_VIDEO_STATUS,
  USER_TYPES,
} from 'utils/constants';
import { useToast } from 'components/utils/Toast';
import {
  moneyFormatInNaira,
  getLocationFromAddress,
  getPropertyHouseType,
  convertUnderscoreToPhrase,
} from 'utils/helpers';
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
import { useChatMessage } from '@/context/ChatContext';
import NumberFormat from 'react-number-format';
import { TickCircle, InfoCircle } from 'iconsax-react';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';
import Label from '../forms/Label';

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
  const { setMessage } = useChatMessage();
  const isVendor = useCurrentRole().role === USER_TYPES.vendor;
  const isAdmin = useCurrentRole().role === USER_TYPES.admin;
  const isUser = useCurrentRole().role === USER_TYPES.user;
  const isAdminOrVendor = isVendor || isAdmin;

  useEffect(() => {
    if (isUser) {
      setMessage(
        `Hello! I am interested in: ${property?.name}. Can you provide more details about this property?`
      );
    }
  }, [property, isUser, setMessage]);

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

        <section className="row mt-4">
          <div className={Sidebar ? 'col-sm-7' : 'col-sm-12'}>
            <PropertyHeader
              property={property}
              enquiryInfo={enquiryInfo}
              vendorInfo={vendorInfo}
              isPortfolioPage={isPortfolioPage}
            />
            <PropertyDescription
              property={property}
              enquiryInfo={enquiryInfo}
              vendorInfo={vendorInfo}
              Actionbar={Actionbar}
              showFull={!!Sidebar}
              isPortfolioPage={isPortfolioPage}
            />
          </div>
          {Sidebar && <div className="col-sm-5">{Sidebar}</div>}
        </section>

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
        <ApprovePropertyButton
          property={property}
          setToast={setToast}
          setProperty={setProperty}
        />
      )}

      {isAdminOrVendor && (
        <DisplayPropertyCompliance property={property} isVendor={isVendor} />
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
const DisplayPropertyCompliance = ({ property, isVendor }) => {
  return (
    <div className="my-5">
      <h5 className="mb-4">Property Verification</h5>

      {isVendor && (
        <div className="my-4 warning-alert">
          <h5 className="header-smaller text-md">For Internal Use Only</h5>
          This section helps us investigate and approve your property, and
          won&apos;t be shown to buyers.
        </div>
      )}
      <Card>
        <Table striped bordered hover>
          <tbody>
            {/* Accessibility to Property Location */}
            <tr>
              <td>
                <strong>Accessibility to Property Location:</strong>
              </td>
              <td>
                {convertUnderscoreToPhrase(property?.compliance?.location)}
              </td>
            </tr>

            {/* Availability of Registered Title */}
            <tr>
              <td>
                <strong>Availability of Registered Title:</strong>
              </td>
              <td>
                {convertUnderscoreToPhrase(
                  property?.compliance?.registeredTitle
                )}
              </td>
            </tr>

            {/* Registered Document */}
            {property?.compliance?.registeredTitle ===
              'Yes, the property has a registered title document' && (
              <tr>
                <td>
                  <strong>Registered Document:</strong>
                </td>
                <td>
                  <a
                    href={property?.compliance?.registeredDocument1}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Document
                  </a>
                </td>
              </tr>
            )}

            {/* Building Approval Status */}
            <tr>
              <td>
                <strong>Building Approval Status:</strong>
              </td>
              <td>
                {convertUnderscoreToPhrase(
                  property?.compliance?.buildingApprovalStatus
                )}
              </td>
            </tr>

            {/* Building Approval Details */}
            {property?.compliance?.buildingApprovalStatus ===
              'completed_processing' && (
              <>
                <tr>
                  <td>
                    <strong>Building Approval Number:</strong>
                  </td>
                  <td>
                    {convertUnderscoreToPhrase(
                      property?.compliance?.buildingApprovalNumber
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Building Approval Document:</strong>
                  </td>
                  <td>
                    <a
                      href={property?.compliance?.registeredDocument2}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </a>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </Table>
      </Card>

      {isVendor && (
        <Button
          color="secondary-light"
          className="mt-4"
          wide
          href={`/vendor/property/edit/${property._id}`}
        >
          Edit Property
        </Button>
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

export const ApprovePropertyButton = ({
  property,
  setToast,
  setProperty = () => {},
  afterSave = () => {},
  className = 'btn btn-danger btn-wide',
}) => {
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
          afterSave();
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
    <div>
      <Button
        color="none"
        className={className}
        onClick={() => setShowApprovalModal(true)}
      >
        Approve Property
      </Button>

      {/* Approve Property Modals */}
      <Modal
        title="Approve Property"
        show={showApprovalModal}
        onHide={() => setShowApprovalModal(false)}
        showFooter={false}
      >
        <section className="row">
          <div className="col-md-12 my-3 text-center">
            <div className="my-2 confirmation-text">
              <div className="fw-bold text-lg mb-2">{property?.name}</div>
              Are you sure you want to approve this property? <br />
            </div>
            <Button
              className="btn btn-danger mb-5"
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
    <Link href={`/vendor/property/edit/${property._id}`}>
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

export const PropertyContact = ({ property }) => {
  return (
    <div className="property-contact mt-5">
      <div className="row">
        <div className="col-md-12 interested-contact">
          <h4 className="text-primary-light mt-0 mb-5">Interested in this?</h4>
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
          header="+2348028337440"
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
          header="+2348028337440"
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
      <Button
        className="btn-xl btn-wide mt-5 btn-md"
        href={`/contact-us?text=Hello, I am interested in the ${property?.name} property. Please provide further details&subject=Property Inquiry: ${property?.name}`}
      >
        Make Enquiry Now
      </Button>
    </div>
  );
};

export const PropertyDescription = ({
  property,
  isPortfolioPage,
  isPublicPage,
  Actionbar,
  showFull,
}) => {
  const [showDescription, setShowDescription] = React.useState(false);
  const [showSafetyTips, setShowSafetyTips] = React.useState(false);
  const DESCRIPTION_LENGTH = 600;
  const hideSomePropertyDescription =
    !showDescription && property.description.length > DESCRIPTION_LENGTH;

  const { asPath } = useRouter();

  const propertyDetails = [
    {
      title: 'Property Name',
      value: property?.name,
      Icon: PropertyIcon,
    },
    {
      title: 'Property Type',
      value: getPropertyHouseType(property),
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
      title: 'Available Units',
      value: `${property.availableUnits} ${Humanize.pluralize(
        property.availableUnits,
        'unit'
      )}`,
      Icon: AssignedPropertyIcon,
    },
    {
      title: 'Title Document',
      value: property?.titleDocument || 'No Title Document',
      Icon: FileIcon,
    },
    {
      title: 'Project Start Date',
      value: property?.projectStartDate
        ? getTinyDate(property?.projectStartDate)
        : null || 'Not Specified',
      Icon: VisitationIcon,
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
    {
      title: 'Delivery State',
      value: property?.deliveryState || 'Finished State',
      Icon: DeliveryStateIcon,
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
            showFull={showFull}
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
      {isPublicPage && <PropertyContact property={property} />}

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

export const PropertyDetailsList = ({ title, Icon, value, showFull }) => (
  <li
    className={`${
      showFull ? 'col-lg-12' : 'col-lg-6'
    } d-flex align-items-center  mt-4`}
  >
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
  <Link href={`/ball-vips/${property?.vendorInfo?.vendor?.slug}`}>
    <a className="btn btn-primary-light btn-wide btn-wide-sm btn-sm">
      View BALL VIP Information <VendorIcon />
      {/* {vendorInfo?.vendor?.companyName} */}
    </a>
  </Link>
);

export const ViewEligibilityButton = ({ property }) => {
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [formData, setFormData] = useState({
    initialPayment: '',
    monthlyPayment: '',
  });
  const [errors, setErrors] = useState({
    initialPayment: '',
    monthlyPayment: '',
  });
  const [userIsEligible, setUserIsEligible] = useState(false);
  const {
    name,
    address,
    houseType,
    mainImage,
    price,
    _id,
    slug,
    favourites,
    pricingModel,
    deliveryState,
  } = property;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleBlur = (field) => {
    const minInitialPayment = 1_000_000;
    const minMonthlyPayment = 100_000;

    if (
      field === 'initialPayment' &&
      formData.initialPayment < minInitialPayment
    ) {
      setErrors({
        ...errors,
        initialPayment: 'Initial payment must be at least 1 million Naira',
      });
    } else if (
      field === 'monthlyPayment' &&
      formData.monthlyPayment < minMonthlyPayment
    ) {
      setErrors({
        ...errors,
        monthlyPayment: 'Monthly payment must be greater than 100,000 Naira',
      });
    } else {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const checkEligibility = () => {
    const propertyPrice = price;
    const calculatedEligibility =
      formData.monthlyPayment * 12 * 5 + formData.initialPayment * 1;

    if (!errors.initialPayment && !errors.monthlyPayment) {
      if (calculatedEligibility >= propertyPrice) {
        setUserIsEligible(true);
      } else {
        setUserIsEligible(false);
      }

      setShowEligibilityModal(false);
      setShowResultModal(true);
    } else {
      alert('Please correct the errors before confirming.');
    }
  };

  const eligibilityClassName = userIsEligible ? 'success-dark' : 'dark';

  return (
    <div>
      <Button
        color="none"
        className="btn-primary-light btn-wide btn-wide-sm btn-sm"
        onClick={() => setShowEligibilityModal(true)}
      >
        Confirm Eligibility
      </Button>

      {/* Eligibility Modal */}
      <Modal
        size="lg"
        title="Confirm Your Eligibility"
        show={showEligibilityModal}
        onHide={() => setShowEligibilityModal(false)}
        showFooter={false}
      >
        <section className="p-4">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="property-holder__big-title">
                {getPropertyHouseType(property)} ({property?.name})
              </h3>
              <h4 className="text-secondary mb-2">
                {moneyFormatInNaira(property.price)}
              </h4>

              <div className="mb-2 text-muted">
                <MapPinIcon /> {getLocationFromAddress(property.address)}
              </div>
            </div>
          </div>

          <div className="dotted-border my-3"></div>

          <div className="row">
            <div className="col-sm-10">
              <div className="form-group">
                <Label name="initialPayment">Initial Payment</Label>
                <NumberFormat
                  className="form-control"
                  placeholder="Initial Payment (Minimum 1 Million Naira)"
                  value={formData.initialPayment}
                  thousandSeparator={true}
                  prefix={'₦ '}
                  onBlur={() => handleBlur('initialPayment')}
                  onValueChange={(values) => {
                    handleChange('initialPayment', values.value);
                  }}
                />
                {errors.initialPayment && (
                  <div className="error-message text-danger mt-2">
                    {errors.initialPayment}
                  </div>
                )}
              </div>

              <div className="form-group">
                <Label name="monthlyPayment">Monthly Payment</Label>
                <NumberFormat
                  className="form-control"
                  placeholder="Monthly Income"
                  value={formData.monthlyPayment}
                  thousandSeparator={true}
                  prefix={'₦ '}
                  onBlur={() => handleBlur('monthlyPayment')}
                  onValueChange={(values) => {
                    handleChange('monthlyPayment', values.value);
                  }}
                />
                {errors.monthlyPayment && (
                  <div className="error-message text-danger mt-2">
                    {errors.monthlyPayment}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            color="primary"
            className="btn btn-primary mt-4"
            onClick={checkEligibility}
          >
            Confirm Eligibility
          </Button>
        </section>
      </Modal>

      {/* Result Modal */}
      <Modal
        title="Eligibility Result"
        show={showResultModal}
        onHide={() => setShowResultModal(false)}
        showFooter={false}
      >
        {userIsEligible && (
          <Realistic
            autorun={{ speed: 0.3, duration: 9_000 }}
            className="position-absolute top-0 left-0 w-100 h-100"
          />
        )}
        <section className="text-center">
          <div className={`pb-4 text-${eligibilityClassName}-dark`}>
            {userIsEligible ? (
              <TickCircle size="96" variant="Bulk" />
            ) : (
              <InfoCircle size="96" variant="Bulk" />
            )}
          </div>
          <h2
            className={`mb-3 text-xl fw-semibold text-${eligibilityClassName}-dark`}
          >
            {userIsEligible ? (
              <>
                Congratulations,
                <br /> You are eligible
              </>
            ) : (
              'You are almost there!'
            )}
          </h2>

          <h4
            className={`mb-5 pb-2 text-${eligibilityClassName}-dark fw-semibold lead-header`}
          >
            {userIsEligible ? (
              <>
                {' '}
                to own {name} - {houseType} in {address?.city}, {address?.state}
              </>
            ) : (
              <>The price of {name} may be above your budget.</>
            )}
          </h4>
        </section>
      </Modal>
    </div>
  );
};

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
            {getPropertyHouseType(property)} ({property?.name})
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
