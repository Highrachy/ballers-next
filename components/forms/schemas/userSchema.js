import * as yup from 'yup';
import {
  stringValidation,
  OptionalPhoneNumber,
  email,
  password,
  strongPassword,
  confirmPassword,
  phoneNumber,
  optionalValidation,
  numberValidation,
  required,
  validPercentage,
  // OptionalPhoneNumber,
} from './schema-helpers';

const agreement = yup
  .array()
  .of(yup.boolean())
  .required('You must agree with our terms and policy to proceed');

export const loginSchema = {
  email,
  password,
};

export const resetPasswordSchema = {
  password: strongPassword,
  confirmPassword: confirmPassword,
};

export const registerSchema = (isUser = true) => {
  let altSchema = {
    firstName: stringValidation('First Name'),
    lastName: stringValidation('Last Name'),
  };

  if (!isUser) {
    altSchema = { companyName: stringValidation('Company Name') };
  }

  return {
    ...altSchema,
    phone: phoneNumber,
    email,
    password: strongPassword,
    confirmPassword: confirmPassword,
    agreement,
  };
};

export const fastTrackVendorSchema = {
  companyName: stringValidation('Company Name'),
  companyLogo: optionalValidation(stringValidation('Company Logo')),
  entity: stringValidation('Entity'),
};

export const changePasswordSchema = {
  oldPassword: strongPassword,
  password: strongPassword,
  confirmPassword: confirmPassword,
};

export const personalInfoSchema = {
  firstName: stringValidation('First Name'),
  lastName: stringValidation('Last Name'),
  phone: phoneNumber,
  phone2: OptionalPhoneNumber,
};

export const preferenceSchema = {
  location: optionalValidation(stringValidation('Location')),
  houseType: optionalValidation(stringValidation('House Type')),
  minPrice: optionalValidation(numberValidation('Minimum Budget', 'budget')),
  maxPrice: optionalValidation(
    numberValidation('Maximum Budget', 'budget').test(
      'maximum',
      'Maximum Budget should be greater than the minimum Budget',
      function () {
        return this.parent.minPrice
          ? this.parent.maxPrice > this.parent.minPrice
          : true;
      }
    )

    //   min(
    //   yup.ref('minPrice') ? yup.ref('minPrice') : 0,
    //   'Maximum Budget should be greater than the minimum Budget'
    // )
  ),
};

export const referralInviteSchema = {
  email,
  firstName: optionalValidation(stringValidation('First Name')),
};

export const userFilterSchema = {
  firstName: optionalValidation(required('First Name')),
  lastName: optionalValidation(required('Last Name')),
  phone: optionalValidation(required('phone')),
  role: optionalValidation(required('role')),
};

export const forgotPasswordSchema = { email };
export const emailSchema = { email };

export const updateRemittanceSchema = {
  percentage: validPercentage('Remittance'),
};
