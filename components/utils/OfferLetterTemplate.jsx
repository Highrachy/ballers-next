import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import {
  moneyFormatInNaira,
  numToWords,
  numToOrdinal,
  moneyFormat,
  getFormattedAddress,
  getLocationFromAddress,
  isValidURL,
  getUserTitle,
  formatInDays,
} from 'utils/helpers';
import { getDate, isPastDate } from 'utils/date-helpers';
import Image, { OnlineImage } from './Image';
import DirectorSignature from 'assets/img/placeholder/signature.png';
import {
  ACTIVE_OFFER_STATUS,
  OFFER_STATUS,
  PAYMENT_OPTION,
  PAYMENT_OPTIONS_BREAKDOWN,
} from 'utils/constants';
import { useCurrentRole } from 'hooks/useUser';

const OfferLetterTemplate = ({
  children,
  enquiryInfo,
  offerInfo,
  propertyInfo,
  signature,
  showSignaturePad,
  vendorInfo,
}) => {
  const companyName = vendorInfo?.vendor?.companyName;
  const shownSignature = signature || offerInfo.signature;

  let { propertySellingPrice, initialPayment, periodicPayment } = offerInfo;

  // Payment Breakdown
  const paymentBreakdown =
    offerInfo?.otherPayments?.paymentBreakdown ||
    offerInfo?.paymentBreakdown ||
    PAYMENT_OPTION.INITIAL_DEPOSIT;

  // Other payments
  const legalFee = parseInt(offerInfo?.otherPayments?.legalFee || 0, 10);
  const agencyFee = parseInt(offerInfo?.otherPayments?.agencyFee || 0, 10);
  const deedOfAssignmentExecution = parseInt(
    offerInfo?.otherPayments?.deedOfAssignmentExecution || 0,
    10
  );
  const infrastructureDevelopment = parseInt(
    offerInfo?.otherPayments?.infrastructureDevelopment || 0,
    10
  );
  const powerConnectionFee = parseInt(
    offerInfo?.otherPayments?.powerConnectionFee || 0,
    10
  );
  const surveyPlan = parseInt(offerInfo?.otherPayments?.surveyPlan || 0, 10);

  const otherPaymentsTotal =
    (legalFee / 100) * offerInfo.propertySellingPrice +
    (agencyFee / 100) * offerInfo.propertySellingPrice +
    deedOfAssignmentExecution +
    infrastructureDevelopment +
    powerConnectionFee +
    surveyPlan;

  // total selling price
  const totalAmountPayable =
    offerInfo?.totalAmountPayable ||
    offerInfo.propertySellingPrice + otherPaymentsTotal;

  // PAYMENT BREAKDOWN FOR TABLE
  // TODO: Replace this with payment schedule from database
  let rangePrice = propertySellingPrice - initialPayment;

  // PAYMENT OPTION 1: INITIAL PAYMENT
  if (paymentBreakdown === PAYMENT_OPTION.INITIAL_DEPOSIT) {
    initialPayment += otherPaymentsTotal;
  }

  const noOfMonths =
    rangePrice / periodicPayment > 1
      ? Math.floor(rangePrice / periodicPayment)
      : 1;

  //TODO: fix last payment if last payment is not 0
  let lastPayment = rangePrice - periodicPayment * noOfMonths;
  let lastPaymentTotal = lastPayment > 0 ? lastPayment : periodicPayment;

  // PAYMENT OPTION 2: EVENLY DISTRIBUTED
  if (paymentBreakdown === PAYMENT_OPTION.EVENLY_DISTRIBUTED) {
    const otherPaymentsEachMonth = otherPaymentsTotal / (noOfMonths + 1);
    initialPayment += otherPaymentsEachMonth;
    periodicPayment += otherPaymentsEachMonth;
    lastPaymentTotal += otherPaymentsEachMonth;
  }

  // PAYMENT OPTION 3: FINAL DEPOSIT
  if (paymentBreakdown === PAYMENT_OPTION.FINAL_DEPOSIT) {
    lastPaymentTotal += otherPaymentsTotal;
  }

  const buyerName = `${enquiryInfo.title} ${enquiryInfo.firstName} ${enquiryInfo.lastName} ${enquiryInfo.otherName}`;
  const houseType = propertyInfo.houseType.toUpperCase();
  const propertyName = propertyInfo.name;
  const isUser = useCurrentRole().isUser;
  const additionalClauses =
    offerInfo?.additionalClause?.clauses || offerInfo?.additionalClause;

  return (
    <Card className="mt-4 p-5 offer-letter-template">
      <div className="text-end">
        <OnlineImage
          src={vendorInfo?.vendor?.companyLogo}
          width="150"
          name={`${companyName} Logo`}
        />
      </div>

      <p className="mt-4">Our Ref: {offerInfo.referenceCode || ''}</p>
      <div className="mb-3">{getDate(offerInfo.createdAt || Date.now())}</div>

      <strong>
        {buyerName}
        <br />
      </strong>
      {getFormattedAddress(enquiryInfo.address)}

      <p className="">Dear {getUserTitle(enquiryInfo.title)},</p>

      <strong>
        RE: {propertyInfo.name} - LETTER OF OFFER FOR {houseType}
      </strong>

      <p className="">
        We refer to your application to purchase an apartment in {propertyName}{' '}
        located on {getLocationFromAddress(enquiryInfo.address)} and are pleased
        to offer you a {houseType} on the following terms and conditions:
      </p>
      <div className="table-responsive">
        <table className="table table-sm table-borderless">
          <tbody>
            <tr>
              <td width="30%">
                <strong>1. VENDOR:</strong>
              </td>
              <td>
                <strong>{companyName}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>2. BUYER:</strong>
              </td>
              <td>
                <strong>{buyerName}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>3. PROPERTY DESCRIPTION:</strong>
              </td>
              <td>{propertyInfo.description}</td>
            </tr>
            <tr>
              <td>
                <strong>4. TITLE:</strong>{' '}
              </td>
              <td>{offerInfo.title}</td>
            </tr>
            <tr>
              <td>
                <strong>5. FACILITIES/SERVICES PROVIDED:</strong>{' '}
              </td>
              <td>
                <ul>
                  {propertyInfo.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <strong>6. COMPLETION DATE </strong>{' '}
              </td>
              <td>{getDate(offerInfo.handOverDate)}</td>
            </tr>
            <tr>
              <td>
                <strong>7. DELIVERY STATE:</strong>{' '}
              </td>
              <td>{offerInfo.deliveryState}</td>
            </tr>
            <tr>
              <td>
                <strong>8. SELLING PRICE:</strong>{' '}
              </td>
              <td>
                {`${moneyFormatInNaira(totalAmountPayable)} (${numToWords(
                  totalAmountPayable
                )} Naira only)`}
              </td>
            </tr>
            {totalAmountPayable !== offerInfo.propertySellingPrice && (
              <tr>
                <td colSpan="2">
                  <div className="table-responsive table-sm">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th className="text-end">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Property Price</td>
                          <td className="text-end">
                            {moneyFormatInNaira(offerInfo.propertySellingPrice)}
                          </td>
                        </tr>
                        {legalFee !== 0 && (
                          <tr>
                            <td>Legal Fee ({legalFee} %) *</td>
                            <td className="text-end">
                              {moneyFormatInNaira(
                                offerInfo.propertySellingPrice *
                                  (legalFee / 100)
                              )}
                            </td>
                          </tr>
                        )}
                        {agencyFee !== 0 && (
                          <tr>
                            <td>Agency Fee ({agencyFee} %) *</td>
                            <td className="text-end">
                              {moneyFormatInNaira(
                                offerInfo.propertySellingPrice *
                                  (agencyFee / 100)
                              )}
                            </td>
                          </tr>
                        )}

                        {powerConnectionFee !== 0 && (
                          <tr>
                            <td>Power Connection Fee *</td>
                            <td className="text-end">
                              {moneyFormatInNaira(powerConnectionFee)}
                            </td>
                          </tr>
                        )}

                        {surveyPlan !== 0 && (
                          <tr>
                            <td>Survey Plan *</td>
                            <td className="text-end">
                              {moneyFormatInNaira(surveyPlan)}
                            </td>
                          </tr>
                        )}

                        {deedOfAssignmentExecution !== 0 && (
                          <tr>
                            <td>Deed of Assignment Execution *</td>
                            <td className="text-end">
                              {moneyFormatInNaira(deedOfAssignmentExecution)}
                            </td>
                          </tr>
                        )}

                        {infrastructureDevelopment !== 0 && (
                          <tr>
                            <td>Infrastructure Development *</td>
                            <td className="text-end">
                              {moneyFormatInNaira(infrastructureDevelopment)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Total</th>
                          <th className="text-end">
                            <h5> {moneyFormatInNaira(totalAmountPayable)}</h5>
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                    <small className="d-block mt-4">
                      {otherPaymentsTotal > 0 &&
                        `* ${PAYMENT_OPTIONS_BREAKDOWN[paymentBreakdown]}`}
                    </small>
                  </div>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <strong>9. PAYMENT PLAN BREAKDOWN</strong>{' '}
              </td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan="2">
                <div className="mb-3 mt-n4">
                  {noOfMonths > 1 && <>Spread payment, see breakdown below; </>}
                </div>
                <div className="table-responsive table-sm">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>DEPOSIT</th>
                        {/* <td>Payment Date</td> */}
                        <th>SUM DUE (N)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Initial Deposit</td>
                        {/* <td>Immediate</td> */}
                        <td>{moneyFormat(initialPayment)}</td>
                      </tr>
                      {noOfMonths > 0 &&
                        [...Array(noOfMonths).keys()].map((value, index) => (
                          <tr key={index}>
                            <td>{numToOrdinal(index + 2)} Deposit</td>
                            <td>
                              {moneyFormat(
                                noOfMonths === index + 1 && lastPayment === 0
                                  ? lastPaymentTotal
                                  : periodicPayment
                              )}
                            </td>
                          </tr>
                        ))}
                      {lastPayment > 0 && (
                        <tr>
                          <td>Last Deposit</td>
                          {/* <td>May 2019</td> */}
                          <td>{moneyFormat(lastPaymentTotal)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <strong>10. ALLOCATION:</strong>
              </td>
              <td>
                Due after the {offerInfo.allocationInPercentage}% of payment
                received.
              </td>
            </tr>
            <tr>
              <td>
                <strong>11. PAYMENT ACCOUNT:</strong>
              </td>
              <td>
                Highrachy Investment and Technology Ltd <br />
                Bank: FIRST BANK OF NIGERIA PLC
                <br />
                Account Number: 2032997125
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <strong>12. OTHER TERMS AND CONDITIONS: </strong>
      <ol type="a">
        <li>
          <p>
            If the Buyer fails, refuses or neglects to pay any instalment within{' '}
            {formatInDays(offerInfo?.otherTerms?.dateDue)} of its falling
            due,the Buyer shall pay the amount due and interest on the amount
            due at the prevailing bank interest rate. If the Buyer fails to pay
            the amount due (plus applicable interest) within{' '}
            {formatInDays(offerInfo?.otherTerms?.gracePeriod)} after the due
            date, the Vendor shall have the right to rescind the sale and the
            deposit already made shall be refunded to the Buyer, less of an
            administrative charge of{' '}
            {offerInfo?.otherTerms?.administrativeCharge}% which will be
            deducted from the amount received from the buyer and the balance
            will be refunded in line with the terms and conditions.
          </p>
        </li>
        <li>
          <p>
            Where the subject unit is not completed within the stipulated time
            frame, due to the negligence or fault of the Vendor, with no
            outstanding defaults on the part of the buyer, a grace period of{' '}
            {formatInDays(offerInfo?.otherTerms?.terminationPeriod)} will be
            granted to the Developer to complete all works after which the Buyer
            shall be entitled to terminate this sale and receive a refund of the
            paid sum. The Vendor shall pay to the Buyer an annual compensation
            of {offerInfo?.otherTerms?.terminationInterest}% of the total amount
            paid to be prorated and payable in monthly tranches.
          </p>
        </li>
        <li>
          <p>
            The Vendor shall execute or facilitate the execution of the Deed of
            Assignment of the property in favour of the buyer ONLY upon full
            payment of the consideration.
          </p>
        </li>
        <li>
          <p>
            The vendor shall support the buyer within her power to undertake the
            survey and perfection of title. The Buyer shall bear all costs and
            expenses of survey and title perfection.
          </p>
        </li>
        <li>
          <p>
            The Buyer shall perform and observe the covenants, terms and
            conditions of {propertyInfo?.address?.state || 'Lagos'} State
            imposed on the property including payment of Land Use Charge,
            tenement rates and any other charges imposed on the property by the
            Local, State or Federal Government of Nigeria and any increment
            thereto. The Buyer shall also be responsible for paying and
            discharging any service charge including electricity bill and any
            other charges set out in the Deed of Assignment and/or service
            management agreement and any increment thereto.
          </p>
        </li>
        <li>
          <p>
            The Buyer shall make and rely upon its own inquiries and shall
            satisfy itself in all respects in relation to the title details
            including all related documentation.
          </p>
        </li>
        <li>
          <p>
            Purchase price or any other part thereof once received is not
            subject to any refund. In exceptional cases where the Vendor in its
            sole discretion accepts to refund the purchase price or any part
            thereof, the property shall first be offered to another buyer and
            the refund shall be made from the purchase price received from the
            subsequent buyer less administrative fees of{' '}
            {offerInfo?.otherTerms?.deductibleRefundPercentage}%.
          </p>
        </li>
        <li>
          <p>
            The buyer is aware that the unit is a part of an estate and buyers
            shall be subject to estate rules, levy and service charges that are
            not included in this offer letter.
          </p>
        </li>

        {additionalClauses?.map((clause, index) => (
          <li key={index}>
            <p>{clause}</p>
          </li>
        ))}
      </ol>

      <p className="">
        If the above terms and conditions are acceptable to you, kindly send in
        your Bank draft or evidence of payment of the initial deposit sum of{' '}
        {` ${moneyFormatInNaira(initialPayment)} (${numToWords(
          initialPayment
        )} Naira only)`}
        , within {offerInfo?.otherTerms?.bankDraftDue} working days (Details of
        bank account in clause 11) from the receipt of this letter.
      </p>

      <p className="">
        We are delighted that you have decided to access this opportunity being
        offered.
      </p>

      <p className="mb-5">
        Yours faithfully,
        <br /> For: {companyName}
      </p>

      {ACTIVE_OFFER_STATUS.includes(offerInfo.status) &&
        (vendorInfo?.vendor?.directors?.length > 0 ? (
          <CompanySignatories vendorInfo={vendorInfo} />
        ) : (
          <>
            <OnlineImage
              className="director-signature"
              name="Signature"
              src={DirectorSignature}
            />

            <h6>Director</h6>
          </>
        ))}

      {((showSignaturePad &&
        isUser &&
        offerInfo.status === OFFER_STATUS.GENERATED &&
        !isPastDate(offerInfo.expires)) ||
        ACTIVE_OFFER_STATUS.includes(offerInfo.status)) && (
        <section className="signature mt-5">
          <h6>MEMORANDUM OF ACCEPTANCE</h6>
          <strong className="text-muted">
            I,{' '}
            <span className="memo-border">
              {enquiryInfo.firstName} {enquiryInfo.lastName}
            </span>{' '}
            having read and understood the content of this offer letter, hereby
            accept the above terms and conditions on{' '}
            <span className="memo-border">
              {getDate(offerInfo?.responseDate || Date.now())}
            </span>
            .
          </strong>

          <h6 className="mt-5 mb-2">Signature</h6>
          <h3 className="signature-pad">
            {shownSignature && (
              <>
                {isValidURL(shownSignature) ? (
                  <OnlineImage
                    className="signature-image uploaded-image mb-3"
                    name="Signature"
                    src={shownSignature}
                  />
                ) : (
                  shownSignature
                )}
              </>
            )}
          </h3>
        </section>
      )}
      {/* TODO: Check Expired */}
      {isPastDate(offerInfo.expires) &&
        (offerInfo.status === OFFER_STATUS.EXPIRED ||
          offerInfo.status === OFFER_STATUS.GENERATED) && (
          <h2 className="text-danger">Offer has expired</h2>
        )}
      {children}
    </Card>
  );
};

OfferLetterTemplate.propTypes = {
  children: PropTypes.any,
  enquiryInfo: PropTypes.object,
  offerInfo: PropTypes.object,
  propertyInfo: PropTypes.object,
  signature: PropTypes.string,
  showSignaturePad: PropTypes.bool,
};

OfferLetterTemplate.defaultProps = {
  children: null,
  enquiryInfo: null,
  offerInfo: null,
  propertyInfo: null,
  signature: null,
  showSignaturePad: false,
};

const CompanySignatories = ({ vendorInfo }) => {
  const directors = vendorInfo?.vendor?.directors || [];
  const signatories = directors.filter(({ isSignatory }) => isSignatory);
  return (
    <section className="row">
      {signatories.map((signatory, index) => (
        <div className="col-sm-6 mb-5" key={index}>
          <OnlineImage
            className="director-signature"
            name="Signature"
            src={signatory.signature}
          />
          <h6>{signatory.name}</h6>
        </div>
      ))}
    </section>
  );
};
export default OfferLetterTemplate;
