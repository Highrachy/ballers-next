import React from 'react';
import WidgetBox from '../WidgetBox';
import StackBox from '../StackBox';
import { differenceInDays, isPastDate } from '@/utils/date-helpers';
import Humanize from 'humanize-plus';
import { ACTIVE_OFFER_STATUS } from '@/utils/constants';
import { getUserName } from '@/utils/helpers';

const RecentOffersWidget = ({ result, role = 'user' }) => {
  return (
    <WidgetBox title="Recent Offers" href={`/${role}/portfolio`} data={result}>
      {result?.map((offer, index) => {
        const user = offer?.userInfo || offer?.vendorInfo;
        const property = offer?.propertyInfo;
        const days = Math.abs(differenceInDays(offer?.expires)) || 0;
        const daysInWords = `${days} ${Humanize.pluralize(days, 'day')}`;
        const offerHasExpired = isPastDate(offer?.expires);
        const dueText = `${
          offerHasExpired ? 'Expired in' : 'Due in'
        }: ${daysInWords}`;
        const activeOffer = ACTIVE_OFFER_STATUS.includes(offer.status);
        const offerColor = activeOffer
          ? 'success'
          : offerHasExpired
          ? 'danger'
          : 'secondary';
        const userFullName = getUserName(user);

        return (
          <StackBox
            avatarColor={offerColor}
            key={index}
            title={property?.name}
            subtitle={`For ${userFullName}`}
            statusColor={offerColor}
            statusName={activeOffer ? 'Active' : dueText}
            href={`/${role}/offer/${offer?._id}`}
          />
        );
      })}
    </WidgetBox>
  );
};

export default RecentOffersWidget;
