import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import { moneyFormatInNaira, getFormattedAddress } from 'utils/helpers';
import { getDateTime, getShortDate } from 'utils/date-helpers';
import { MessageIcon } from 'components/utils/Icons';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import CardTableSection from 'components/common/CardTableSection';
import { useCurrentRole } from 'hooks/useUser';
import { PAYMENT_FREQUENCY } from 'utils/constants';
import Humanize from 'humanize-plus';
import CreateOfferLetter from '../pages/vendor/CreateOfferLetter';

const pageOptions = {
  key: 'enquiry',
  pageName: 'Enquiries',
};

const SingleEnquiry = ({ id }) => {
  const [toast, setToast] = useToast();
  const [showEnquiry, setShowEnquiry] = React.useState(true);
  const [enquiryQuery, enquiry] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneEnquiry(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <ContentLoader
        hasContent={!!enquiry}
        Icon={<MessageIcon />}
        query={enquiryQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        {showEnquiry ? (
          <EnquiryDetail
            enquiry={enquiry}
            toast={toast}
            showOfferLetter={() => setShowEnquiry(false)}
          />
        ) : (
          <CreateOfferLetter enquiry={enquiry} />
        )}
      </ContentLoader>
    </BackendPage>
  );
};

const EnquiryDetail = ({ enquiry, showOfferLetter, toast }) => (
  <div className="container-fluid">
    <Toast {...toast} />
    <div className="mt-5 mb-3">
      <h3>
        {enquiry.title} {enquiry.firstName} Enquiry Form
      </h3>
    </div>
    <CardTableSection name="Client Details">
      <tr>
        <td>
          <strong>Name</strong>
        </td>
        <td>
          {enquiry.title} {enquiry.firstName} {enquiry.lastName}{' '}
          {enquiry.otherName}
        </td>
      </tr>
      <tr>
        <td>
          <strong>Email</strong>
        </td>
        <td>{enquiry.email}</td>
      </tr>
      <tr>
        <td>
          <strong>Phone</strong>
        </td>
        <td>{enquiry.phone}</td>
      </tr>
      <tr>
        <td>
          <strong>Occupation</strong>
        </td>
        <td>{enquiry.occupation}</td>
      </tr>
      <tr>
        <td>
          <strong>Address</strong>
        </td>
        <td>{getFormattedAddress(enquiry.address)}</td>
      </tr>
    </CardTableSection>
    <CardTableSection name="Name on Title Document">
      <tr>
        <td>
          <h5 className="mt-3">{enquiry.nameOnTitleDocument}</h5>
        </td>
      </tr>
    </CardTableSection>
    <CardTableSection name="Property details">
      <tr>
        <td>
          <strong>Property Name</strong>
        </td>
        <td>{enquiry.propertyInfo.name}</td>
      </tr>
      <tr>
        <td>
          <strong>House Type</strong>
        </td>
        <td>{enquiry.propertyInfo.houseType}</td>
      </tr>
      <tr>
        <td>
          <strong>Price</strong>
        </td>
        <td>{moneyFormatInNaira(enquiry.propertyInfo.price)}</td>
      </tr>
      <tr>
        <td>
          <strong>Units</strong>
        </td>
        <td>
          {enquiry.propertyInfo.units}{' '}
          {Humanize.pluralize(enquiry.propertyInfo.units, 'unit')}
        </td>
      </tr>
      <tr>
        <td>
          <strong>Bedrooms</strong>
        </td>
        <td>
          {enquiry.propertyInfo.bedrooms}{' '}
          {Humanize.pluralize(enquiry.propertyInfo.bedrooms, 'bedroom')}
        </td>
      </tr>
      <tr>
        <td>
          <strong>Bathrooms</strong>
        </td>
        <td>
          {enquiry.propertyInfo.bathrooms}{' '}
          {Humanize.pluralize(enquiry.propertyInfo.bathrooms, 'bathrooms')}
        </td>
      </tr>
      <tr>
        <td>
          <strong>Toilets</strong>
        </td>
        <td>
          {enquiry.propertyInfo.toilets}{' '}
          {Humanize.pluralize(enquiry.propertyInfo.toilets, 'toilet')}
        </td>
      </tr>
      <tr>
        <td>
          <strong>Address</strong>
        </td>
        <td>{getFormattedAddress(enquiry.propertyInfo.address)}</td>
      </tr>
    </CardTableSection>
    <CardTableSection name="Investment details">
      <tr>
        <td>
          <strong>Initial Investment Amount</strong>
        </td>
        <td>{moneyFormatInNaira(enquiry.initialInvestmentAmount)}</td>
      </tr>
      <tr>
        <td>
          <strong>Investment Frequency</strong>
        </td>
        <td>{PAYMENT_FREQUENCY[enquiry.investmentFrequency]} </td>
      </tr>
      <tr>
        <td>
          <strong>Investment Start Date</strong>
        </td>
        <td>{getShortDate(enquiry.investmentStartDate)}</td>
      </tr>
      <tr>
        <td>
          <strong>Periodic Investment Amount</strong>
        </td>
        <td>{moneyFormatInNaira(enquiry.periodicInvestmentAmount)}</td>
      </tr>
    </CardTableSection>
    <CardTableSection name="Additional Details">
      <tr>
        <td>
          <strong>Created At</strong>
        </td>
        <td>{getDateTime(enquiry.createdAt)}</td>
      </tr>
      <tr>
        <td>
          <strong>Updated At</strong>
        </td>
        <td>{getDateTime(enquiry.updatedAt)}</td>
      </tr>
    </CardTableSection>

    {useCurrentRole().isVendor && !enquiry.approved && (
      <button
        className="btn btn-secondary btn-wide"
        onClick={() => showOfferLetter()}
      >
        Create Offer Letter
      </button>
    )}
  </div>
);

export default SingleEnquiry;
