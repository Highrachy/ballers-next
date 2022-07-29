import {
  stringValidation,
  required,
  phoneNumber,
  optionalValidation,
  lengthValidation,
} from './schema-helpers';

export const companyInfoSchema = {
  companyName: stringValidation('Company Name'),
  entity: required('Register As'),
  redanNumber: optionalValidation(required('Redan Number')),
};

export const phoneNumbersSchema = {
  phone: phoneNumber,
  phone2: optionalValidation(phoneNumber),
};

export const bankSchema = {
  accountName: stringValidation('Account Name'),
  accountNumber: lengthValidation('Account Number', 10),
  bankName: stringValidation('Bank Name'),
};

export const signatorySchema = {
  name: stringValidation('Director Name'),
  phone: phoneNumber,
  isSignatory: optionalValidation(required('Signatory')),
};
export const certificateSchema = {
  type: optionalValidation(required('Certificate Type')),
};
export const commentSchema = {
  comment: required('Comment'),
};
