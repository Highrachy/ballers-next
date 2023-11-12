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
import { differenceInDays, getTinyDate, isPastDate } from 'utils/date-helpers';
import Humanize from 'humanize-plus';
import { OnlineImage } from '../utils/Image';
import MakePayment from '../shared/MakePayment';
import { MODEL } from '@/utils/constants';
import { parseISO } from 'date-fns';

export const PortfolioPaymentProgress = ({ amountPaid, percentage }) => (
  <div className="row">
    <div className="col-sm-12 mt-0">
      <div className="text-sm mb-1">
        <span className="text-primary">
          Contributed: {moneyFormatInNaira(amountPaid)}
        </span>
        <span className="float-end">{`${percentage}%`}</span>
      </div>
      <ProgressBar
        variant="secondary"
        now={percentage}
        style={{
          height: '6px',
        }}
        srOnly
      />
    </div>
  </div>
);

export const PortfolioCard = ({
  _id,
  propertyInfo,
  nextPaymentInfo,
  setToast,
  ...portfolio
}) => {
  const nextPayment = nextPaymentInfo?.[0];
  const overdueDate = nextPayment?.dueDate || nextPayment?.expiresOn;
  const amountPaid = nextPayment?.totalTransactions || 0;
  const propertyPrice = portfolio?.totalAmountPayable || 0;
  const percentage = Math.round(
    Math.min(100, (amountPaid / propertyPrice) * 100)
  );
  const expectedAmount =
    Math.round((nextPayment?.expectedAmount || 0) * 100) / 100;

  return (
    <Card className="card-container portfolio-holder property-card">
      <section className="card-body">
        <article className="row row-eq-height">
          <aside className="col-sm-6">
            <div className="h-100">
              <OnlineImage
                name={propertyInfo?.name}
                src={propertyInfo?.mainImage || PropertyPlaceholderImage}
                alt="Property"
                className="img-cover h-100"
              />
            </div>
          </aside>
          <aside className="h-100 col-sm-6 pt-3 pt-md-0">
            <div className="portfolio-content position-relative pt-2 pe-2">
              <aside className="float-end">
                <OverdueBadge date={overdueDate} />
              </aside>
              <h5 className="property-name text-gray">{propertyInfo?.name}</h5>
              {/* Details */}
              <div className="property-details property-spacing">
                <span className="property-holder__house-type">
                  <strong>
                    <PropertyIcon /> {propertyInfo?.houseType}
                  </strong>
                </span>{' '}
                &nbsp; | &nbsp;
                <span className="property-holder__location">
                  <strong>
                    <MapPinIcon /> {propertyInfo?.address?.city},{' '}
                    {propertyInfo?.address?.state}
                  </strong>
                </span>
              </div>
              {/* Price */}
              <h4 className="property-price text-dark property-spacing">
                {moneyFormatInNaira(propertyPrice)}
              </h4>

              {/* Separator */}
              <div className="property-holder__separator my-4"></div>

              {/* Payment Progress */}
              <PortfolioPaymentProgress
                amountPaid={amountPaid}
                percentage={percentage}
              />

              {/* Payment Info */}
              {/* <p className="text-gray text-sm mt-4 mb-1">Next Payment</p> */}
              <section className="info-content">
                <span className="info-content__price">
                  {moneyFormatInNaira(expectedAmount)}
                </span>
                {/* todo */}
                &nbsp; due on &nbsp;
                {getTinyDate(overdueDate)}
              </section>

              {/* <section className="property-spacing">
                <span className="property-holder__location icon-sm">
                  <strong>
                    <Clock variant="Bulk" /> &nbsp;15th March, 2023
                  </strong>
                </span>
              </section> */}

              {/* View Button */}
              <div className="property-holder__btn text-end">
                <MakePayment
                  setToast={setToast}
                  amount={expectedAmount}
                  model={{
                    offerId: portfolio?._id,
                    type: MODEL.OFFER,
                  }}
                />
                <Link href={`/user/portfolio/${_id}`}>
                  <a className="btn btn-secondary-light btn-wide fw-bold btn-sm ms-3">
                    View Portfolio
                  </a>
                </Link>
              </div>
            </div>
          </aside>
        </article>
      </section>
    </Card>
  );
};

export const OverdueBadge = ({ date }) => {
  const formattedDate = parseISO(date);
  const days = Math.abs(differenceInDays(formattedDate)) || 0;
  const daysInWords = `${days} ${Humanize.pluralize(days, 'day')}`;
  return isPastDate(formattedDate) ? (
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

const PortfoliosRowList = ({ setToast, results }) =>
  results.map((portfolio, index) => (
    <div className="col-sm-12 mb-4" key={index}>
      <PortfolioCard setToast={setToast} {...portfolio} />
    </div>
  ));

export default PortfolioCards;
