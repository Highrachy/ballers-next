import {
  required,
  requiredDate,
  positiveNumberValidation,
  optionalValidation,
  moneyRange,
} from './schema-helpers';

export const addTransactionSchema = {
  amount: positiveNumberValidation('Amount', 'amount'),
  additionalInfo: required('Additional Info'),
  paidOn: requiredDate('Paid On'),
};

export const onlinePaymentSchema = {
  amount: moneyRange('Amount', 'amount', 1_000, 1_000_000),
};

export const offlinePaymentSchema = {
  amount: positiveNumberValidation('Amount', 'amount'),
  bankId: required('Bank'),
  dateOfPayment: requiredDate('Payment Date'),
  receipt: optionalValidation(required('Receipt')),
  type: required('Payment Type'),
};
