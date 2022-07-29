import { stringValidation } from './schema-helpers';

export const addBankAccountSchema = {
  accountName: stringValidation('Account Name'),
  accountNumber: stringValidation('Account Number'),
  bankName: stringValidation('Bank Name'),
};
