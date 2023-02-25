import React from 'react';
import PropTypes from 'prop-types';
import { Card, ProgressBar } from 'react-bootstrap';
import Link from 'next/link';
import PropertyPlaceholderImage from 'assets/img/placeholder/property-holder.jpg';
import { MapPinIcon, PortfolioIcon } from 'components/utils/Icons';
import { moneyFormatInNaira } from 'utils/helpers';
import PaginatedContent from 'components/common/PaginatedContent';
import { PropertyIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import { differenceInDays, isPastDate } from 'utils/date-helpers';
import Humanize from 'humanize-plus';
import { Spacing } from './Helpers';
import { OnlineImage } from '../utils/Image';

export const PortfolioPaymentProgress = ({ amountPaid, percentage }) => (
  <div className="row">
    <div className="col-sm-12 mt-3">
      <div className="small" style={{ paddingLeft: `${percentage - 5}%` }}>
        {percentage}%
      </div>
      <ProgressBar
        variant="success"
        now={percentage}
        label={`${percentage}%`}
        srOnly
      />
      <div className="small">
        Amount Contributed: <strong>{moneyFormatInNaira(amountPaid)}</strong>
        <span className="float-end text-green">Goal</span>
      </div>
    </div>
  </div>
);

export const PortfolioCard = ({
  _id,
  totalAmountPayable,
  propertyInfo,
  nextPaymentInfo,
}) => {
  return (
    <Card className="card-container h-100 portfolio-holder property-card">
      <Link href={`/user/portfolio/${_id}`}>
        <article>
          <div className="content-image">
            <OnlineImage
              name={propertyInfo.name}
              src={propertyInfo.mainImage || PropertyPlaceholderImage}
              alt="Property"
              className="img-fluid property-holder__img"
            />
          </div>
          <div className="property-item">
            <h5 className="property-name mb-0">{}</h5>
            {/* Details */}
            <div className="property-details property-spacing">
              <span className="property-holder__house-type">
                <strong>
                  <PropertyIcon /> {propertyInfo.houseType}
                </strong>
              </span>{' '}
              &nbsp; | &nbsp;
              <span className="property-holder__location">
                <strong>
                  <MapPinIcon /> {propertyInfo.address?.city},{' '}
                  {propertyInfo.address?.state}
                </strong>
              </span>
            </div>
            {/* Price */}
            <h5 className="property-price property-spacing">
              {moneyFormatInNaira(totalAmountPayable)}
            </h5>
          </div>

          {/* Next Payment Info */}
          <div className="property-holder__separator my-3"></div>
          <div className="property-info property-spacing px-4">
            Next Payment:{' '}
            <strong>
              {moneyFormatInNaira(nextPaymentInfo?.[0]?.expectedAmount)}
            </strong>
            <Spacing />
            <Spacing />
            <OverdueBadge
              date={
                nextPaymentInfo?.[0]?.dueDate || nextPaymentInfo?.[0]?.expiresOn
              }
            />
          </div>
        </article>
      </Link>
    </Card>
  );
};

export const OverdueBadge = ({ date }) => {
  const days = Math.abs(differenceInDays(date)) || 0;
  const daysInWords = `${days} ${Humanize.pluralize(days, 'day')}`;
  return isPastDate(date) ? (
    <div className="badge badge-overdue badge-overdue__danger">
      Overdue: <strong>{daysInWords} ago</strong>
    </div>
  ) : (
    <div className="badge  badge-overdue badge-overdue__success">
      Due: <strong>{daysInWords}</strong>
    </div>
  );
};

const PortfolioCards = ({ limit, hideTitle, hidePagination }) => (
  <PaginatedContent
    endpoint={API_ENDPOINT.getAllPortfolios()}
    pageName="Portfolio"
    pluralPageName="Portfolios"
    DataComponent={PortfoliosRowList}
    PageIcon={<PortfolioIcon />}
    queryName="portfolio"
    limit={limit}
    hideTitle={hideTitle}
    hidePagination={hidePagination}
  />
);

PortfolioCards.propTypes = {
  setToast: PropTypes.func,
  isSinglePortfolio: PropTypes.bool,
};

PortfolioCards.defaultProps = {
  setToast: () => {},
  isSinglePortfolio: false,
};

const PortfoliosRowList = ({ results }) =>
  results.map((portfolio, index) => (
    <div className="col-sm-6 mb-4" key={index}>
      <PortfolioCard {...portfolio} />
    </div>
  ));

export default PortfolioCards;
