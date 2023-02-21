import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card, ProgressBar } from 'react-bootstrap';
import { Link } from '@reach/router';
import { useToast } from 'components/utils/Toast';
import { PortfolioIcon } from 'components/utils/Icons';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { OwnedPropertyCard } from '../shared/SingleProperty';
import { moneyFormatInNaira } from 'utils/helpers';
import { getTinyDate } from 'utils/date-helpers';
import { LinkSeparator } from 'components/common/Helpers';
import MakePayment from './MakePayment';
import { OverdueBadge } from 'components/common/PortfolioCards';
import Button from 'components/forms/Button';
import Modal from 'components/common/Modal';
import { Form, Formik } from 'formik';
import Textarea from 'components/forms/Textarea';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import {
  DisplayFormikState,
  setInitialValues,
} from 'components/forms/form-helper';
import { BASE_API_URL, MODEL } from 'utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError, statusIsSuccessful } from 'utils/helpers';
import { addTestimonialSchema } from 'components/forms/schemas/propertySchema';

const pageOptions = {
  key: 'portfolio',
  pageName: 'Portfolio',
};

const SinglePortfolio = ({ id }) => {
  const [toast, setToast] = useToast();
  const [portfolioQuery, portfolio, setPortfolio] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOnePortfolio(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!portfolio}
        Icon={<PortfolioIcon />}
        query={portfolioQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <OwnedPropertyCard
          property={{
            ...portfolio?.propertyInfo,
            price: portfolio?.totalAmountPayable,
            videos: portfolio?.videos || [],
            testimonials: portfolio?.testimonials || [],
          }}
          enquiryInfo={portfolio?.enquiryInfo}
          vendorInfo={portfolio?.vendorInfo}
          setToast={setToast}
          setProperty={setPortfolio}
          Sidebar={
            <AssignedPropertySidebar
              portfolio={portfolio}
              setToast={setToast}
            />
          }
          isPortfolioPage
        />
      </ContentLoader>
    </BackendPage>
  );
};

const AssignedPropertySidebar = ({ portfolio, setToast }) => {
  const nextPayment = portfolio?.nextPaymentInfo?.[0];

  const NOW = Math.round(
    (portfolio.amountContributed / portfolio.totalAmountPayable) * 100
  );
  const balance = portfolio.amountContributed - portfolio.totalAmountPayable;

  return (
    <>
      <Card className="card-container property-holder">
        <h5 className="header-smaller">
          Next Payment{' '}
          <OverdueBadge date={nextPayment?.dueDate || nextPayment?.expiresOn} />
        </h5>
        <table className="table table-sm table-borderless table-no-padding">
          <tbody>
            <tr>
              <td>
                <small className="ms-n1">Expected Payment</small>{' '}
              </td>
              <td>
                <h5>{moneyFormatInNaira(nextPayment?.expectedAmount)}</h5>
              </td>
            </tr>
            <tr>
              <td>
                <small className="ms-n1">Due Date</small>{' '}
              </td>
              <td>
                <h5>
                  {getTinyDate(nextPayment?.dueDate || nextPayment?.expiresOn)}
                </h5>
              </td>
            </tr>
          </tbody>
        </table>

        <MakePayment
          setToast={setToast}
          amount={portfolio?.nextPaymentInfo?.[0]?.expectedAmount || 0}
          model={{
            offerId: portfolio?._id,
            type: MODEL.OFFER,
          }}
        />

        <section className="mt-5 mb-3">
          <div className="text-small">Contribution Progress</div>
          <div className="row">
            <div className="col-sm-12">
              <small style={{ paddingLeft: `${Math.min(90, NOW - 5)}%` }}>
                {NOW}%
              </small>
              <ProgressBar
                variant="success"
                now={NOW}
                label={`${NOW}%`}
                srOnly
              />
            </div>
          </div>
        </section>

        <table className="table table-sm table-borderless table-no-padding">
          <tbody>
            <tr>
              <td>
                <small className="ms-n1">Equity Amount</small>{' '}
              </td>
              <td>
                <h5>{moneyFormatInNaira(portfolio.totalAmountPayable)}</h5>
              </td>
            </tr>
            <tr>
              <td>
                <small className="ms-n1">Amount Contributed</small>{' '}
              </td>
              <td>
                <h5>{moneyFormatInNaira(portfolio.amountContributed)}</h5>
              </td>
            </tr>
            <tr className="border-top border-bottom">
              <td>
                <small className="ms-n1">Outstanding Balance</small>{' '}
              </td>
              <td>
                <h5
                  className={`${balance < 0 ? 'text-danger' : 'text-success'}`}
                >
                  {moneyFormatInNaira(balance)}
                </h5>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-center mt-3">
          <Link
            to={`/user/offer/${portfolio._id}`}
            className="text-link text-secondary text-small"
          >
            View Offer Letter
          </Link>
          <LinkSeparator />
          <Link
            to="/users/transaction"
            className="text-link text-secondary text-small"
          >
            Transaction History
          </Link>
        </div>
      </Card>
      <LovePropertySidebar portfolio={portfolio} setToast={setToast} />
    </>
  );
};

const LovePropertySidebar = ({ portfolio, setToast }) => {
  const [showTestimonialModal, setShowTestimonialModal] = React.useState(false);
  const hasTestimonial = !!portfolio?.testimonials?.find(
    (testimonial) => testimonial.userId === portfolio?.userId
  );
  return (
    <Card className="card-container property-holder">
      <h5 className="header-smaller">Love this Property?</h5>
      <Link
        to={`/user/property/enquiry/${portfolio?.propertyInfo._id}`}
        className="btn btn-info btn-block my-3"
      >
        Buy Property Again
      </Link>

      {!hasTestimonial && portfolio?.amountContributed > 0 && (
        <>
          <Button
            color="dark"
            className="btn-block my-2"
            onClick={() => setShowTestimonialModal(true)}
          >
            Leave a Review
          </Button>
        </>
      )}
      {/* Testimonial Modal */}
      <ModalToShowTestimonial
        portfolio={portfolio}
        showTestimonialModal={showTestimonialModal}
        setShowTestimonialModal={setShowTestimonialModal}
        setToast={setToast}
      />
    </Card>
  );
};

const ModalToShowTestimonial = ({
  portfolio,
  showTestimonialModal,
  setShowTestimonialModal,
  setToast,
}) => {
  console.log(`portfolio`, portfolio);
  return (
    <Modal
      title="Leave a Review"
      show={showTestimonialModal}
      onHide={() => setShowTestimonialModal(false)}
      showFooter={false}
    >
      <section className="row">
        <div className="col-md-12 my-3">
          <Formik
            initialValues={setInitialValues(addTestimonialSchema)}
            onSubmit={({ testimonial }, actions) => {
              const payload = {
                offerId: portfolio._id,
                testimonial,
              };
              Axios.post(
                `${BASE_API_URL}/property/testimonial`,
                { ...payload },
                {
                  headers: { Authorization: getTokenFromStore() },
                }
              )
                .then((response) => {
                  const { status } = response;
                  if (statusIsSuccessful(status)) {
                    setToast({
                      type: 'success',
                      message: `Your Testimonial has been successfully submitted`,
                    });
                    actions.setSubmitting(false);
                    actions.resetForm();
                    setShowTestimonialModal(false);
                  }
                })
                .catch(function (error) {
                  setToast({
                    message: getError(error),
                  });
                  actions.setSubmitting(false);
                });
            }}
            validationSchema={createSchema(addTestimonialSchema)}
          >
            {({ isSubmitting, handleSubmit, ...props }) => (
              <Form>
                <Textarea
                  name="testimonial"
                  label="Add Testimonial"
                  placeholder="Your Comment"
                  rows="3"
                />
                <Button
                  className="btn-secondary mt-4"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                >
                  Add Testimonial
                </Button>
                <DisplayFormikState {...props} hide showAll />
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </Modal>
  );
};

export default SinglePortfolio;
