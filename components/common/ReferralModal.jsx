import React from 'react';
import Link from 'next/link';
import { HouseIcon } from '@/components/utils/Icons';
import { BASE_API_URL } from '@/utils/constants';
import Modal from '@/components/common/Modal';
import axios from 'axios';
import { storeReferralInfo } from '@/utils/localStorage';

const ReferralModal = ({ inviteCode, referralCode }) => {
  const [showReferralModal, setShowReferralModal] = React.useState(false);
  const [referral, setReferral] = React.useState(null);

  React.useEffect(() => {
    referralCode &&
      axios
        .get(`${BASE_API_URL}/referral/ref/${referralCode}`)
        .then((response) => {
          const { status, data } = response;
          if (status === 200) {
            setReferral({ referrer: data.user });
            setShowReferralModal(true);
            storeReferralInfo({ referrer: { ...data.user, referralCode } });
          }
        })
        .catch((error) => {
          setReferral(null);
        });
  }, [referralCode]);

  React.useEffect(() => {
    inviteCode &&
      axios
        .get(`${BASE_API_URL}/referral/${inviteCode}`)
        .then((response) => {
          const { status, data } = response;
          if (status === 200) {
            setReferral(data.referral);
            setShowReferralModal(true);
            storeReferralInfo({ ...data.referral });
          }
        })
        .catch((error) => {
          setReferral(null);
        });
  }, [inviteCode]);

  return referral ? (
    <Modal
      title="Welcome to Ball"
      show={showReferralModal}
      onHide={() => setShowReferralModal(false)}
      showFooter={false}
    >
      <section className="row">
        <div className="col-md-12 my-3 text-center">
          <HouseIcon />
          <h3 className="my-4">
            Hello{referral.firstName ? ` ${referral.firstName}` : ''},
          </h3>
          <p className="lead">
            {referral.referrer.firstName} has invited you to{' '}
            <strong>become a Landlord.</strong>
          </p>

          <Link href="/register">
            <a className="btn btn-secondary my-4">Register for Free</a>
          </Link>
        </div>
      </section>
    </Modal>
  ) : null;
};

export default ReferralModal;
