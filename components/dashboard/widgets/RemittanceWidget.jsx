import React from 'react';
import WidgetBox from '../WidgetBox';
import StackBox from '../StackBox';
import { moneyFormatInNaira } from '@/utils/helpers';
import { DEFAULT_VENDOR_PERCENTAGE } from '@/utils/constants';

const RemittanceWidget = ({
  result,
  title,
  role = 'user',
  avatarColor = 'danger',
}) => {
  return (
    <WidgetBox title={title} href={`/${role}/transactions`} data={result}>
      {result?.map((transaction, index) => {
        const { propertyInfo, vendorInfo, remittance, userInfo } = transaction;
        const remittancePercentage =
          vendorInfo?.vendor?.remittancePercentage || DEFAULT_VENDOR_PERCENTAGE;
        const amountPaid = Math.round(
          ((100 - remittancePercentage) / 100) * transaction?.amount
        );

        return (
          <StackBox
            key={index}
            href={`/${role}/transactions`}
            title={propertyInfo?.name}
            subtitle={
              role === 'admin'
                ? vendorInfo?.vendor?.companyName
                : `${userInfo?.firstName} ${userInfo?.lastName}`
            }
            value={moneyFormatInNaira(amountPaid)}
            statusColor={remittance?.status ? 'success' : 'danger'}
            avatarColor={avatarColor}
            statusName={remittance?.status ? 'Paid' : 'Awaiting Payment'}
          />
        );
      })}
    </WidgetBox>
  );
};

export default RemittanceWidget;
