import React from 'react';
import WidgetBox from '../WidgetBox';
import StackBox from '../StackBox';
import { getDate } from '@/utils/date-helpers';
import { moneyFormatInNaira } from '@/utils/helpers';

const RecentTransactionsWidget = ({ result, role = 'user' }) => {
  return (
    <WidgetBox
      title="Recent Transactions"
      href={`/${role}/transactions`}
      data={result}
    >
      {result?.map((transaction, index) => {
        const property = transaction?.propertyInfo;
        const vas = transaction?.vasInfo;

        return (
          <StackBox
            key={index}
            src={property?.mainImage}
            title={property?.name || vas?.name}
            subtitle={`Paid on ${getDate(transaction?.paidOn)}`}
            value={moneyFormatInNaira(transaction?.amount)}
            statusColor={
              transaction.paymentSource === 'Paystack' ? 'secondary' : 'success'
            }
            statusName={transaction?.paymentSource}
          />
        );
      })}
    </WidgetBox>
  );
};

export default RecentTransactionsWidget;
