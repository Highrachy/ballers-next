import React from 'react';
import BackendPage from 'components/layout/BackendPage';
import Toast, { useToast } from 'components/utils/Toast';
import { moneyFormatInNaira, getFormattedAddress } from 'utils/helpers';
import { MessageIcon } from 'components/utils/Icons';
import { useGetQuery } from 'hooks/useQuery';
import { API_ENDPOINT } from 'utils/URL';
import { ContentLoader } from 'components/utils/LoadingItems';
import CardTableSection from 'components/common/CardTableSection';
import Humanize from 'humanize-plus';
import MakePayment from './MakePayment';
import { MODEL } from 'utils/constants';
import WelcomeHero from '../common/WelcomeHero';

const pageOptions = {
  key: 'vasRequest',
  pageName: 'Request',
};

const SingleVasRequest = ({ id }) => {
  const [toast, setToast] = useToast();
  const [vasRequestQuery, vasRequest] = useGetQuery({
    key: pageOptions.key,
    name: [pageOptions.key, id],
    setToast,
    endpoint: API_ENDPOINT.getOneVasRequest(id),
    refresh: true,
  });

  return (
    <BackendPage>
      <WelcomeHero
        title={vasRequest?.vasInfo?.name || 'Service Request'}
        subtitle="Request for Service"
      />
      <ContentLoader
        hasContent={!!vasRequest}
        Icon={<MessageIcon />}
        query={vasRequestQuery}
        name={pageOptions.pageName}
        toast={toast}
      >
        <VasRequestDetail
          vasRequest={vasRequest}
          toast={toast}
          setToast={setToast}
        />
      </ContentLoader>
    </BackendPage>
  );
};

const VasRequestDetail = ({ vasRequest, toast, setToast }) => (
  <div className="container-fluid">
    <Toast {...toast} />
    <div className="mt-5 mb-3">
      {/* <h3>{vasRequest?.vasInfo?.name} Request</h3> */}
    </div>
    <CardTableSection name="Service Information">
      <tr>
        <td>
          <strong>Name</strong>
        </td>
        <td>{vasRequest?.vasInfo.name}</td>
      </tr>
      <tr>
        <td>
          <strong>Price</strong>
        </td>
        <td>{moneyFormatInNaira(vasRequest?.vasInfo.price)}</td>
      </tr>
      <tr>
        <td>
          <strong>Status</strong>
        </td>
        <td>{vasRequest.status}</td>
      </tr>
      <tr>
        <td>
          <strong>Description</strong>
        </td>
        <td>{vasRequest?.vasInfo.description}</td>
      </tr>
    </CardTableSection>
    {vasRequest?.propertyInfo && (
      <CardTableSection name="Property details">
        <tr>
          <td>
            <strong>Property Name</strong>
          </td>
          <td>{vasRequest.propertyInfo.name}</td>
        </tr>
        <tr>
          <td>
            <strong>House Type</strong>
          </td>
          <td>{vasRequest.propertyInfo.houseType}</td>
        </tr>
        <tr>
          <td>
            <strong>Price</strong>
          </td>
          <td>{moneyFormatInNaira(vasRequest.propertyInfo.price)}</td>
        </tr>
        <tr>
          <td>
            <strong>Units</strong>
          </td>
          <td>
            {vasRequest.propertyInfo.units}{' '}
            {Humanize.pluralize(vasRequest.propertyInfo.units, 'unit')}
          </td>
        </tr>
        <tr>
          <td>
            <strong>Bedrooms</strong>
          </td>
          <td>
            {vasRequest.propertyInfo.bedrooms}{' '}
            {Humanize.pluralize(vasRequest.propertyInfo.bedrooms, 'bedroom')}
          </td>
        </tr>
        <tr>
          <td>
            <strong>Bathrooms</strong>
          </td>
          <td>
            {vasRequest.propertyInfo.bathrooms}{' '}
            {Humanize.pluralize(vasRequest.propertyInfo.bathrooms, 'bathrooms')}
          </td>
        </tr>
        <tr>
          <td>
            <strong>Toilets</strong>
          </td>
          <td>
            {vasRequest.propertyInfo.toilets}{' '}
            {Humanize.pluralize(vasRequest.propertyInfo.toilets, 'toilet')}
          </td>
        </tr>
        <tr>
          <td>
            <strong>Address</strong>
          </td>
          <td>{getFormattedAddress(vasRequest.propertyInfo.address)}</td>
        </tr>
      </CardTableSection>
    )}

    <div className="row">
      <div className="col-sm-3">
        <MakePayment
          setToast={setToast}
          amount={vasRequest?.vasInfo.price || 0}
          model={{
            vasRequestId: vasRequest?._id,
            type: MODEL.VAS_REQUEST,
            // propertyId: vasRequest?.propertyInfo?._id,
          }}
        />
      </div>
    </div>
  </div>
);

export default SingleVasRequest;
