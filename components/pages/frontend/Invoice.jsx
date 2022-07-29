import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import BallersLogo from 'assets/img/logo/ballers-logo.png';
import { getTinyDate } from 'utils/date-helpers';
import {
  getFormattedAddress,
  moneyFormatInNaira,
  statusIsSuccessful,
} from 'utils/helpers';
import * as queryString from 'query-string';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import { getError } from 'utils/helpers';
import Toast, { useToast } from 'components/utils/Toast';
import { BASE_API_URL, MODEL } from 'utils/constants';
import { Loading } from 'components/utils/LoadingItems';
import { TransactionIcon } from 'components/utils/Icons';
import { API_ENDPOINT } from 'utils/URL';

const Invoice = (props) => {
  const queryParams = queryString.parse(props.location.search);
  const { reference } = queryParams;
  const [toast, setToast] = useToast();
  const [transaction, setTransaction] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const [offer, setOffer] = React.useState(null);
  const [vasRequest, setVasRequest] = React.useState(null);

  React.useEffect(() => {
    Axios.get(`${BASE_API_URL}/payment/process/${reference}`, {
      headers: {
        Authorization: getTokenFromStore(),
      },
    })
      .then(function (response) {
        const { status, data } = response;
        setTransaction(data.transaction);

        let url;

        switch (data?.transaction.model.type) {
          case MODEL.OFFER:
            url = API_ENDPOINT.getOneOffer(data.transaction.model.offerId);
            break;
          case MODEL.VAS_REQUEST:
            url = API_ENDPOINT.getOneVasRequest(
              data.transaction.model.vasRequestId
            );
            break;

          default:
            break;
        }

        if (statusIsSuccessful(status) && url) {
          Axios.get(url, {
            headers: {
              Authorization: getTokenFromStore(),
            },
          })
            .then(function (response) {
              const { status, data } = response;
              console.log(`data`, data);
              if (statusIsSuccessful(status)) {
                MODEL.OFFER && setOffer(data.offer);
                MODEL.VAS_REQUEST && setVasRequest(data.vasRequest);
                setUserInfo(
                  data?.offer?.userInfo || data?.vasRequest?.userInfo
                );
              }
            })
            .catch(function (error) {
              setToast({
                message: getError(error),
              });
            });
        }
      })
      .catch(function (error) {
        setToast({
          message: getError(error),
        });
      });
  }, [setToast, reference]);

  return (
    <>
      <Toast {...toast} showToastOnly />
      <Header />
      {transaction && userInfo && (offer?.propertyInfo || vasRequest) ? (
        <InvoiceContent
          transaction={transaction}
          userInfo={userInfo}
          paymentInfo={generatePaymentInfo({
            offer,
            vasRequest,
            type: transaction.model.type,
          })}
        />
      ) : (
        <div className="ballers-invoice">
          <div className="mt-8">
            <Loading
              text="Loading Payment Information"
              Icon={<TransactionIcon />}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export const InvoiceContent = ({ paymentInfo, transaction, userInfo }) => {
  const userName = `${userInfo.firstName} ${userInfo.lastName}`;

  return (
    <div className="ballers-invoice">
      <section className="invoice__page">
        <div className="row">
          <div className="col-sm-12 mb-1 mb-sm-4 invoice__content">
            <div className="card-body d-flex flex-column">
              {/* Logo */}
              <div>
                <img alt="Logo" className="invoice__logo" src={BallersLogo} />
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
                        <td className="text-right">
                          <p className="mb-2">+234 708 7821 561</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="mb-0">
                            Receipt No: <strong>BA21001</strong>
                          </p>
                        </td>
                        <td className="text-right">
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
                    <th className="text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tr-content">
                    <td>
                      <p className="mt-2 mt-sm-3">{paymentInfo.title}</p>
                    </td>
                    <td className="text-right text-amount strong">
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
                    <th className="text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tr-content tr-border-bottom">
                    <td>
                      <small>Via {transaction.paymentSource}</small>
                      <br />
                      <small>Payment for {paymentInfo.paymentType}</small>
                    </td>
                    <td>
                      <h4 className="my-4">
                        {getTinyDate(transaction.paidOn)}
                      </h4>
                    </td>
                    <td className="text-right text-green">
                      <h4 className="text-amount">
                        {' '}
                        {moneyFormatInNaira(transaction.amount)}
                      </h4>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <span className="text-small mt-3 text-muted">
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
                <div className="col-6 text-right">
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
      </section>
    </div>
  );
};

export const generatePaymentInfo = ({ offer, vasRequest, type }) => {
  const propertyInfo = offer?.propertyInfo || vasRequest?.propertyInfo;
  let title, paymentType;

  const description = propertyInfo && (
    <small>
      <strong>
        {propertyInfo.name} {propertyInfo.houseType}
      </strong>
      {getFormattedAddress(propertyInfo.address)}
    </small>
  );

  switch (type) {
    case MODEL.OFFER:
      title = `Payment for ${propertyInfo.name}`;
      paymentType = 'Property';
      break;

    case MODEL.VAS_REQUEST:
      title = `Payment for ${vasRequest?.vasInfo?.name}`;
      paymentType = 'Services';
      break;

    default:
      break;
  }

  return { title, description, paymentType };
};

export default Invoice;
