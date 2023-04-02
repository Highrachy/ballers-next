import React from 'react';
import PropTypes from 'prop-types';
import BackendPage from 'components/layout/BackendPage';
import { Card } from 'react-bootstrap';
import Axios from 'axios';
import {
  ACTIVE_OFFER_STATUS,
  BASE_API_URL,
  OFFER_STATUS,
} from 'utils/constants';
import Toast, { useToast } from 'components/utils/Toast';
import { getTokenFromStore } from 'utils/localStorage';
import LoadItems from 'components/utils/LoadingItems';
import NoContent from 'components/utils/NoContent';
import { TransactionIcon } from 'components/utils/Icons';
import { getError, moneyFormatInNaira } from 'utils/helpers';
import TopTitle from 'components/utils/TopTitle';
import ProfileAvatar from 'assets/img/avatar/profile.png';
import Modal from 'components/common/Modal';
import { NewTransactionForm } from './NewTransaction';
import { LocalImage } from '@/components/utils/Image';

const AddTransaction = () => {
  const [toast, setToast] = useToast();
  const [offers, setOffers] = React.useState(null);
  React.useEffect(() => {
    Axios.get(`${BASE_API_URL}/offer/admin/all`, {
      headers: {
        Authorization: getTokenFromStore(),
      },
    })
      .then(function (response) {
        const { status, data } = response;
        // handle success
        if (status === 200) {
          setOffers(data.offers);
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  }, [setToast]);
  return (
    <BackendPage>
      <Toast {...toast} showToastOnly />
      <TopTitle>All Offers</TopTitle>
      <AllOffers offers={offers} />
    </BackendPage>
  );
};

const AllOffers = ({ offers, toast }) => (
  <LoadItems
    Icon={<TransactionIcon />}
    items={offers}
    loadingText="Loading your Offers"
    noContent={
      <NoContent Icon={<TransactionIcon />} isButton text="No Offers found" />
    }
  >
    <OffersRowList toast={toast} offers={offers || []} />
  </LoadItems>
);

const OffersRowList = ({ offers }) => (
  <div className="container-fluid mb-5">
    <Card>
      <div className="table-responsive">
        <table className="table table-border table-hover mb-0">
          <tbody>
            {offers.map((offer, index) => (
              <OffersRow key={index} number={index + 1} {...offer} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

OffersRowList.propTypes = {
  offers: PropTypes.array.isRequired,
};

const OffersRow = ({
  status,
  _id,
  totalAmountPayable,
  number,
  initialPayment,
  periodicPayment,
  enquiryInfo,
  propertyInfo,
  userInfo,
}) => {
  const [showAddTransactionModal, setShowAddTransactionModal] =
    React.useState(false);
  if (!ACTIVE_OFFER_STATUS.includes(status)) {
    return null;
  }

  return (
    <>
      <tr>
        {/* <td>{number}</td>{' '} */}
        <td>
          <LocalImage
            alt={propertyInfo.name}
            className="img-fluid avatar--medium--small rounded"
            src={
              propertyInfo.mainImage ? propertyInfo.mainImage : ProfileAvatar
            }
            title={propertyInfo.name}
          />
        </td>
        <td>
          <strong>{propertyInfo.name}</strong>
          <br />
          <small>
            {propertyInfo.address.city}, {propertyInfo.address.state}
          </small>
        </td>
        <td>
          <strong>{moneyFormatInNaira(totalAmountPayable)}</strong>
        </td>
        <td>
          <strong>
            {enquiryInfo.firstName} {enquiryInfo.lastName}
          </strong>
          <br />
          <small>{enquiryInfo.phone}</small>
        </td>
        <td>
          <button
            onClick={() => setShowAddTransactionModal(true)}
            className="btn btn-sm btn-secondary"
          >
            Add Payment
          </button>
        </td>
      </tr>
      <Modal
        title="Add Transaction"
        show={showAddTransactionModal}
        onHide={() => setShowAddTransactionModal(false)}
        showFooter={false}
      >
        <NewTransactionForm
          hideForm={() => setShowAddTransactionModal(false)}
          amount={
            status === OFFER_STATUS.INTERESTED
              ? initialPayment
              : periodicPayment
          }
          offerId={_id}
          propertyId={propertyInfo._id}
          userId={userInfo._id}
        />
      </Modal>
    </>
  );
};

export default AddTransaction;
