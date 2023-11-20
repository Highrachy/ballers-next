import { Button, Card } from 'react-bootstrap';
import { WalletIcon } from '../utils/Icons';
import MakePayment from '../shared/MakePayment';
import { MODEL } from '@/utils/constants';
import { moneyFormatInNaira } from '@/utils/helpers';

export const WalletInfoBox = ({ setToast, result }) => {
  const color = 'secondary';
  return (
    <div className="container-fluid py-0 mt-n6">
      <Card className="info-box widget card d-block my-4 position-relative h-100">
        <div className="radial__bg"></div>
        <section className={`widget-${color} p-3 pb-0`}>
          <div className="card-body">
            <div className="row">
              <h2 className={`fw-bolder text-primary mb-0`}>
                {moneyFormatInNaira(result?.payments?.totalAmountInWallet || 0)}
              </h2>
              <h5 className={`mt-2 fw-bold text-${color}`}>Your BALL Wallet</h5>

              <div className="col-8">
                <p className="mb-4 text-gray">
                  Watch your dreams grow in your BALL Wallet. Your financial
                  journey starts here!
                </p>
                <MakePayment
                  buttonClassName="btn btn-secondary-light btn-sm btn-wide fw-bold"
                  text="Add Funds"
                  setToast={setToast}
                  amount={0}
                  model={{
                    type: MODEL.WALLET,
                  }}
                />
              </div>
              <div className="col-3 col-sm-4 text-end widget-svg">
                <WalletIcon />
              </div>
            </div>
          </div>
        </section>
      </Card>
    </div>
  );
};

export default WalletInfoBox;
