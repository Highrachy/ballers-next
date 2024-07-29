import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import BallersLogo from '../../utils/BallersLogo';
import { getTinyDate } from 'utils/date-helpers';
import {
  calculateLocalTransactionFee,
  getFormattedAddress,
  moneyFormatInNaira,
  statusIsSuccessful,
} from 'utils/helpers';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError } from 'utils/helpers';
import Toast, { useToast } from 'components/utils/Toast';
import { BASE_API_URL, MODEL } from 'utils/constants';
import { Loading } from 'components/utils/LoadingItems';
import { TransactionIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';
import { useRouter } from 'next/router';
import NoContent from '@/components/utils/NoContent';
import InvoicePDFDocument from './InvoicePDFDocument';

const Invoice = (props) => {
  const router = useRouter();
  const queryParams = router.query;
  const { reference } = queryParams;
  const [toast, setToast] = useToast();
  const [transaction, setTransaction] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (reference) {
      setLoading(true);
      Axios.get(`${BASE_API_URL}/payment/process/${reference}`, {
        headers: {
          Authorization: getTokenFromStore(),
        },
      })
        .then(function (response) {
          const { status, data } = response;
          setTransaction(data.transaction);
        })
        .catch(function (error) {
          setLoading(false);
          setToast({
            message: getError(error),
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setToast, reference]);

  return (
    <>
      <Toast {...toast} showToastOnly />
      <Header />
      {transaction ? (
        <InvoiceContent transaction={transaction} />
      ) : (
        <div className="ballers-invoice">
          <div className="mt-8">
            {loading ? (
              <Loading
                text="Loading Payment Information"
                Icon={<TransactionIcon />}
              />
            ) : (
              <NoContent
                text="No Payment Information Found"
                Icon={<TransactionIcon />}
              />
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export const InvoiceContent = ({ transaction }) => {
  const { userInfo, vasRequestInfo, propertyInfo } = transaction || {};
  const paymentInfo = generatePaymentInfo({
    vasRequest: vasRequestInfo,
    type: transaction.model.type,
    propertyInfo,
  });

  const userName = `${userInfo.firstName} ${userInfo.lastName}`;

  return (
    <div className="ballers-invoice">
      <section className="invoice__page">
        <div className="row">
          <div className="col-sm-12 mb-1 mb-sm-4 invoice__content">
            <div className="card-body d-flex flex-column">
              {/* Logo */}
              <div>
                <BallersLogo
                  className="ballers-logo-footer"
                  width="86"
                  height="55"
                />
              </div>

              {/* Header Details */}
              <div className="invoice__separator">
                <div className="d-flex flex-column">
                  <table>
                    <tbody>
                      <tr className="tr-content">
                        <td colSpan={2}>
                          <h6 className="mb-2 mb-sm-3 invoice__email">
                            {userName}
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="mb-2">
                            Date Issued:{' '}
                            <strong>{getTinyDate(transaction.paidOn)}</strong>
                          </p>
                        </td>
                        <td className="text-end">
                          <p className="mb-2">+234 708 7821 561</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="mb-0">
                            Receipt No: <strong>{transaction.receiptNo}</strong>
                          </p>
                        </td>
                        <td className="text-end">
                          <p className="mb-0">info@ballers.ng</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Receipt Details */}
              <table className="invoice__separator invoice__table">
                <thead>
                  <tr className="tr-header tr-border-bottom">
                    <th>DESCRIPTION</th>
                    <th className="text-end">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tr-content">
                    <td>
                      <p className="mt-2 mt-sm-3 mb-0">{paymentInfo.title}</p>
                    </td>
                    <td className="text-end text-amount strong">
                      <p className="mt-2 mt-sm-3">
                        {moneyFormatInNaira(transaction.amount)}
                      </p>
                    </td>
                  </tr>
                  <tr className="tr-content">
                    <td>{paymentInfo.description}</td>
                    <td>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
              <div className="invoice__separator"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Details */}
      <section className="invoice__page invoice__footer">
        <div className="row">
          <div className="col-sm-12">
            <div className="d-flex flex-column">
              <table className="mt-3 mt-sm-5 invoice__table">
                <thead>
                  <tr className="tr-header tr-border-bottom">
                    <th>PAYMENT INFO</th>
                    <th>PAID ON</th>
                    <th className="text-end">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tr-content tr-border-bottom">
                    <td>
                      <small>Via {transaction.paymentSource}</small>
                      <br />
                      <small>{paymentInfo.title}</small>
                    </td>
                    <td>
                      <h4 className="my-4">
                        {getTinyDate(transaction.paidOn)}
                      </h4>
                    </td>
                    <td className="text-end text-green">
                      <h4 className="text-amount">
                        {' '}
                        {moneyFormatInNaira(transaction.amount)}
                      </h4>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      {/* Paystack Charges */}
                      {transaction?.paymentSource == 'Paystack' && (
                        <p className="text-md mt-3 mb-0">
                          Paystack (Debit/Credit Cards) Fees - &nbsp;
                          <strong className="text-primary">
                            {moneyFormatInNaira(
                              calculateLocalTransactionFee(
                                transaction?.amount || 0
                              )
                            )}
                          </strong>
                        </p>
                      )}

                      <span className="text-sm mt-3 text-muted">
                        Ref: {transaction.additionalInfo} / {transaction._id}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="row invoice__separator">
                <div className="col-6">
                  <h5>Thank You!</h5>
                </div>
                <div className="col-6 text-end">
                  <h5 className="text-uppercase invoice__tag-line">
                    Become A Landlord
                  </h5>
                </div>
              </div>

              <div className="row invoice__separator">
                <div className="text-center text-muted text-smaller w-100">
                  This receipt is automatically generated at Ballers.ng
                </div>
              </div>
            </div>
          </div>
        </div>

        <InvoicePDFDocument
          transaction={transaction}
          paymentInfo={paymentInfo}
        />
      </section>
    </div>
  );
};

export const generatePaymentInfo = ({
  paymentInfo,
  vasRequest,
  type,
  propertyInfo,
}) => {
  let title, paymentType, description;

  console.log('paymentInfo', paymentInfo);
  const propertyDescription = propertyInfo && (
    <small>
      <strong>
        {propertyInfo.name} {propertyInfo.houseType}
      </strong>
      {getFormattedAddress(propertyInfo.address)}
    </small>
  );

  switch (type) {
    case MODEL.OFFER:
      title = `Payment for ${propertyInfo?.name}`;
      paymentType = 'Property';
      description = propertyDescription;
      break;

    case MODEL.VAS_REQUEST:
      title = `Payment for ${vasRequest?.vasInfo?.name}`;
      paymentType = 'Services';
      description = propertyDescription;
      break;

    case MODEL.WALLET:
      title = `Payment into your BALL wallet`;
      paymentType = 'Wallet';
      description = '';
      break;

    default:
      break;
  }

  return { title, description, paymentType };
};

export default Invoice;
