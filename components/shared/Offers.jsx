import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import PaginatedContent from 'components/common/PaginatedContent';
import { API_ENDPOINT } from 'utils/URL';
import { moneyFormatInNaira } from 'utils/helpers';
import { ACTIVE_OFFER_STATUS } from 'utils/constants';
import { SuccessIcon } from 'components/utils/Icons';
import { InfoIcon } from 'components/utils/Icons';
import { useCurrentRole } from 'hooks/useUser';
import { OfferIcon } from 'components/utils/Icons';
import UserCard from 'components/common/UserCard';
import { PropertyAvatar } from 'components/common/PropertyCard';
import WelcomeHero from '../common/WelcomeHero';

const Offers = () => (
  <BackendPage>
    <WelcomeHero title={`Offers`} subtitle={`Manage your offers here`} />
    <PaginatedContent
      endpoint={API_ENDPOINT.getAllOffers()}
      pageName="Offer"
      pluralPageName="Offers"
      DataComponent={OffersRowList}
      PageIcon={<OfferIcon />}
      queryName="offer"
    />
  </BackendPage>
);

export const OffersRowList = ({ results, offset }) => (
  <div className="container-fluid mb-5">
    <Card>
      <div className="table-responsive">
        <table className="table table-border table-hover mb-0">
          <tbody>
            {results?.map((offer, index) => (
              <OffersRow key={index} number={offset + index + 1} {...offer} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

export const OffersRow = ({
  status,
  _id,
  totalAmountPayable,
  number,
  expires,
  enquiryInfo,
  vendorInfo,
  userInfo,
  propertyInfo,
}) => (
  <>
    <tr>
      <td>{number}</td>
      <td>
        {/* <img
          alt={propertyInfo.name}
          className="img-fluid avatar--medium--small rounded"
          src={propertyInfo.mainImage ? propertyInfo.mainImage : ProfileAvatar}
          title={propertyInfo.name}
        /> */}
        <PropertyAvatar property={propertyInfo} />
      </td>

      {useCurrentRole().isUser ? (
        <td>
          <strong>{vendorInfo?.vendor?.companyName}</strong>
          <br />
          <small>{vendorInfo?.phone}</small>
        </td>
      ) : (
        <td>
          <UserCard user={userInfo} hideImage />
        </td>
      )}
      <td>
        {ACTIVE_OFFER_STATUS.includes(status) ? (
          <small className="text-success">
            <SuccessIcon /> {status}
          </small>
        ) : (
          <small className="text-danger">
            <InfoIcon /> {status}
          </small>
        )}
      </td>
      <td>
        <h5 className="text-end text-secondary ls-1">
          {moneyFormatInNaira(totalAmountPayable)}
        </h5>
      </td>

      <td>
        <Link passHref href={`/${useCurrentRole().name}/offer/${_id}`}>
          <a className="btn btn-sm btn-secondary-light btn-wide">View Offer</a>
        </Link>
      </td>
    </tr>
  </>
);

export default Offers;
