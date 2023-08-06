import React from 'react';
import WidgetBox from '../WidgetBox';
import StackBox from '../StackBox';

const PendingPropertyVideosWidget = ({ result, role = 'vendor' }) => {
  return (
    <WidgetBox
      title="Pending Video Approvals"
      href={`/${role}/propertyVideos`}
      data={result}
    >
      {result?.map((video, index) => {
        const vendorInfo = video?.vendorInfo;
        const propertyInfo = video?.propertyInfo;
        const videoId = video?.url?.substr(video?.url.length - 11);
        const videoImage = `https://i1.ytimg.com/vi/${videoId}/0.jpg`;
        return (
          <StackBox
            key={index}
            src={videoImage}
            title={video?.title}
            subtitle={`${propertyInfo?.name} (${propertyInfo?.houseType})`}
            value={role === 'admin' ? vendorInfo?.vendor?.companyName : ''}
            statusName={'Awaiting Confirmation'}
            statusColor="danger"
          />
        );
      })}
    </WidgetBox>
  );
};

export default PendingPropertyVideosWidget;
