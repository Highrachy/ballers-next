import React from 'react';
import WidgetBox from '../WidgetBox';
import StackBox from '../StackBox';
import { moneyFormatInNaira } from '@/utils/helpers';
import { getDateStatus } from '@/utils/date-helpers';

const PendingPropertiesWidget = ({ result, role = 'vendor' }) => {
  return (
    <WidgetBox
      title="Pending Properties"
      href={`/${role}/property`}
      data={result}
    >
      {result?.map((property, index) => {
        const vendorInfo = property?.vendorInfo;
        const { statusColor, statusName } = getDateStatus(
          property?.createdAt,
          'secondary'
        );
        return (
          <StackBox
            key={index}
            src={property?.mainImage}
            title={`${property?.name} (${property?.houseType})`}
            subtitle={
              role === 'vendor'
                ? 'Awaiting Confirmation'
                : vendorInfo?.vendor?.companyName
            }
            value={moneyFormatInNaira(property?.price)}
            statusColor={statusColor}
            statusName={statusName}
            href={`/${role}/properties/${property?._id}`}
          />
        );
      })}
    </WidgetBox>
  );
};

export default PendingPropertiesWidget;
