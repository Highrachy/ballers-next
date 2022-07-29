import {
  stringValidation,
  optionalValidation,
  // minDateValidation,
  required,
} from './schema-helpers';

export const addEnquirySchema = {
  title: stringValidation('Title'),
  firstName: stringValidation('First Name'),
  lastName: stringValidation('Last Name'),
  otherName: optionalValidation(required('Other Name')),
  occupation: stringValidation('Occupation'),
  nameOnTitleDocument: stringValidation('Name on Title Document'),
  investmentStartDate: required('Investment Start Date', new Date()),
  initialInvestmentAmount: stringValidation('Initial Investment Amount'),
  investmentFrequency: required('Investment Frequency'),
  periodicInvestmentAmount: stringValidation('Periodic Investment Amount'),
};
