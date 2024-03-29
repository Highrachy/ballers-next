import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import { moneyFormatInNaira, getFormattedAddress } from 'utils/helpers';
import { getShortDate, getTinyDate } from 'utils/date-helpers';
import { MessageIcon } from 'components/utils/Icons';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import { useCurrentRole } from 'hooks/useUser';
import { PAYMENT_FREQUENCY } from 'utils/constants';
import Humanize from 'humanize-plus';
import WelcomeHero from 'components/common/WelcomeHero';
import Button from 'components/forms/Button';
import DataList, { DataItem } from '../common/DataList';

const pageOptions = {
  key: 'enquiry',
  pageName: 'Enquiries',
};

const SingleEnquiry = ({ id }) => {
  const [toast, setToast] = useToast();
  const [enquiryQuery, enquiry] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneEnquiry(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <WelcomeHero
        title="Single Enquiry"
        subtitle="View enquiries and create offer letters for applicants."
      />
      <ContentLoader
        hasContent={!!enquiry}
        Icon={<MessageIcon />}
        query={enquiryQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <NewEnquiry enquiry={enquiry} toast={toast} />
      </ContentLoader>
    </BackendPage>
  );
};

const NewEnquiry = ({ enquiry, showOfferLetter, toast }) => (
  <div className="container-fluid">
    <div className="row mt-5">
      <div className="col-lg-8">
        <EnquiryHeader enquiry={enquiry} />
      </div>
      <div className="col-lg-4 text-end">
        <CreateOfferLetterButton enquiry={enquiry} />
      </div>
    </div>

    <div className="row gy-5">
      <div className="col-lg-6">
        <DataList header="Applicant Information">
          <DataItem
            label="Full Name"
            value={
              <>
                {enquiry.title} {enquiry.firstName} {enquiry.lastName}{' '}
                {enquiry.otherName}
              </>
            }
          />
          <DataItem label="Email" value={enquiry.email} />
          <DataItem label="Phone Number" value={enquiry.phone} />
          <DataItem
            label="Status"
            value={<span className="text-success fw-bold">Approved</span>}
          />
          <DataItem
            label="Address"
            value={getFormattedAddress(enquiry.address)}
          />
          <DataItem
            label="Name on Title Document"
            value={enquiry.nameOnTitleDocument}
          />
        </DataList>

        <DataList header="Investment Information">
          <DataItem
            label="Initial Investment Amount"
            value={moneyFormatInNaira(enquiry.initialInvestmentAmount)}
          />
          <DataItem
            label="Investment Frequency"
            value={PAYMENT_FREQUENCY[enquiry.investmentFrequency]}
          />
          <DataItem
            label="Investment Start Date"
            value={getShortDate(enquiry.investmentStartDate)}
          />
          <DataItem
            label="Periodic Investment Amount"
            value={moneyFormatInNaira(enquiry.periodicInvestmentAmount)}
          />
        </DataList>
        <div className="mt-4">
          <CreateOfferLetterButton enquiry={enquiry} />
        </div>
      </div>
      <div className="col-lg-6">
        <DataList header="Property Details">
          <DataItem label="Property Name" value={enquiry.propertyInfo.name} />
          <DataItem label="House Type" value={enquiry.propertyInfo.houseType} />
          <DataItem
            label="Price"
            value={moneyFormatInNaira(enquiry.propertyInfo.price)}
          />
          <DataItem
            label="Units"
            value={
              <>
                {enquiry.propertyInfo.units}{' '}
                {Humanize.pluralize(enquiry.propertyInfo.units, 'unit')}
              </>
            }
          />
          <DataItem
            label="Bedrooms"
            value={
              <>
                {enquiry.propertyInfo.bedrooms}{' '}
                {Humanize.pluralize(enquiry.propertyInfo.bedrooms, 'bedroom')}
              </>
            }
          />
          <DataItem
            label="Bathrooms"
            value={
              <>
                {enquiry.propertyInfo.bathrooms}{' '}
                {Humanize.pluralize(enquiry.propertyInfo.bathrooms, 'bathroom')}
              </>
            }
          />
          <DataItem
            label="Toilets"
            value={
              <>
                {enquiry.propertyInfo.toilets}{' '}
                {Humanize.pluralize(enquiry.propertyInfo.toilets, 'toilet')}
              </>
            }
          />
          <DataItem
            label="Address"
            value={getFormattedAddress(enquiry.propertyInfo.address)}
          />
        </DataList>
      </div>
    </div>
  </div>
);

const CreateOfferLetterButton = ({ enquiry }) => {
  return (
    useCurrentRole().isVendor &&
    !enquiry.approved && (
      <Button
        className="btn btn-secondary btn-wide"
        href={`/vendor/enquiries/${enquiry?._id}/create-offer-letter`}
      >
        Create Offer Letter
      </Button>
    )
  );
};

export const EnquiryHeader = ({ enquiry }) => (
  <>
    <h3 className="header-title">
      <strong>
        {enquiry.title} {enquiry.firstName} {enquiry.lastName}
      </strong>
    </h3>
    <ul className="list-inline text-soft">
      <li className="list-inline-item pe-2">
        Status: <span className="text-success fw-bold">Approved</span>
      </li>
      <li className="list-inline-item pe-2">
        Submitted At:{' '}
        <span className="text-primary">{getTinyDate(enquiry.createdAt)}</span>
      </li>
    </ul>
  </>
);
export default SingleEnquiry;
