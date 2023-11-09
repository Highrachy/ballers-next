import {
  stringValidation,
  positiveNumberValidation,
  validPercentage,
  required,
  minDateValidation,
  optionalValidation,
  numberValidation,
} from './schema-helpers';

export const sharedOfferSchema = {
  allocationInPercentage: validPercentage('Allocation'),
  expires: required('Offer Expires'),
  title: stringValidation('Title Document'),
  deliveryState: stringValidation('Delivery State'),
};

export const offerTemplateSchema = {
  name: required('Name'),
  ...sharedOfferSchema,
};

export const offerLetterSchema = {
  propertySellingPrice: positiveNumberValidation('Total Amount Payable'),
  initialPayment: positiveNumberValidation('Initial Payment'),
  initialPaymentDate: minDateValidation('Initial Payment Date', new Date()),
  handOverDate: minDateValidation('Completion Date', new Date()),
  periodicPayment: numberValidation('Periodic Payment'),
  paymentFrequency: optionalValidation(required('Payment Frequency')),
  ...sharedOfferSchema,
};

export const otherPaymentsSchema = {
  agencyFee: optionalValidation(required('Agency Fee')),
  deedOfAssignmentExecution: optionalValidation(
    required('Deed of Assignment Execution')
  ),
  infrastructureDevelopment: optionalValidation(
    required('Infrastructure Development')
  ),
  legalFee: optionalValidation(required('Legal Fee')),
  powerConnectionFee: optionalValidation(required('Connection Power Fee')),
  surveyPlan: optionalValidation(required('Survey Plan')),
  paymentBreakdown: optionalValidation(required('Payment Breakdown')),
};

export const otherTermsSchema = {
  administrativeCharge: optionalValidation(required('Administrative Charge')),
  bankDraftDue: optionalValidation(required('Bank Draft Due')),
  dateDue: optionalValidation(required('Date Due')),
  deductibleRefundPercentage: optionalValidation(
    required('Deductible Refund Percentage')
  ),
  gracePeriod: optionalValidation(required('Grace Period')),
  terminationInterest: optionalValidation(required('Termination Interest')),
  terminationPeriod: optionalValidation(required('Termination Period')),
};

export const raiseAConcernSchema = {
  question: required('Question'),
};

export const resolveAConcernSchema = {
  response: required('Response'),
};

export const requestTermsReviewSchema = {
  comment: required('Comment'),
};
export const respondTermsReviewSchema = {
  response: required('Response'),
};

export const reactivateOfferSchema = {
  initialPaymentDate: minDateValidation('Initial Payment Date', new Date()),
  expires: required('Offer Expires'),
};
