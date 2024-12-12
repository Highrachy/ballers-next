import { Button, Card } from 'react-bootstrap';
import { WalletIcon } from '../utils/Icons';
import MakePayment from '../shared/MakePayment';
import { MODEL, RECURRING_CHARGES_DAY } from '@/utils/constants';
import { moneyFormatInNaira } from '@/utils/helpers';
import SetupRecurringCharges from '../shared/SetupRecurringCharges.jsx';
import React from 'react';
import { UserContext } from '@/context/UserContext';
import { getDate } from '@/utils/date-helpers';

export const WalletInfoBox = ({ setToast, result }) => {
  const { userState } = React.useContext(UserContext);
  const recurringCharges = userState?.recurringCharges || {};
  const { status, chargeType, lastChargeDate, nextChargeDate, amount } =
    recurringCharges;
  const recurringChargeIsActive = status === 'active';
  const color = 'secondary';
  return (
    <section id="wallet">
      <div className="container-fluid py-0 mt-n6">
        <Card className="info-box widget card d-block my-4 position-relative h-100">
          <div className="radial__bg"></div>
          <section className={`widget-${color} p-3 pb-0`}>
            <div className="card-body">
              <div className="row">
                <h2 className={`fw-bolder text-primary mb-0`}>
                  {moneyFormatInNaira(
                    result?.payments?.totalAmountInWallet || 0
                  )}
                </h2>
                <h5 className={`mt-2 fw-bold text-${color}`}>
                  Your BALL Wallet
                </h5>
                <div className="col-8">
                  {recurringChargeIsActive ? (
                    <p className="mb-4 text-gray">
                      Your recurring charge is active! You&apos;re on track to
                      achieving your homeownership goals effortlessly.
                    </p>
                  ) : (
                    <p className="mb-4 text-gray">
                      Activate your recurring charges to start growing your
                      savings with BALL and bring your homeownership dreams
                      closer.
                    </p>
                  )}
                  <MakePayment
                    buttonClassName="btn btn-secondary-light btn-sm btn-wide fw-bold me-3"
                    text="Add Funds"
                    setToast={setToast}
                    amount={0}
                    model={{
                      type: MODEL.WALLET,
                    }}
                  />
                  {recurringChargeIsActive && (
                    <p className="mb-4 text-sm mt-3 text-gray">
                      Recurring charge:{' '}
                      <strong>
                        {RECURRING_CHARGES_DAY[chargeType] || 'Unknown'}
                      </strong>{' '}
                      &nbsp;|&nbsp;
                      <strong>Amount:</strong> {moneyFormatInNaira(amount)}{' '}
                      &nbsp;|&nbsp;
                      <strong>Next charge:</strong> {getDate(nextChargeDate)}.
                    </p>
                  )}

                  {!recurringChargeIsActive && (
                    <SetupRecurringCharges
                      buttonClassName="btn btn-success-light btn-sm btn-wide fw-bold me-3"
                      text="Set Up Recurring Charges"
                      setToast={setToast}
                      amount={0}
                      model={{
                        type: MODEL.WALLET,
                      }}
                    />
                  )}
                </div>
                <div className="col-3 col-sm-4 text-end widget-svg">
                  <WalletIcon />
                </div>
              </div>
            </div>
          </section>
        </Card>
      </div>
    </section>
  );
};

export default WalletInfoBox;
