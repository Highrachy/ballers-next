import * as yup from 'yup';
import { parseISO } from 'date-fns';
import { moneyFormatInNaira } from 'utils/helpers';

export const required = (label) =>
  yup.string().required(`${label} is required`);

export const optionalValidation = (validation) =>
  yup.lazy((value) => {
    if (value && value !== JSON.stringify('') && !Array.isArray(value)) {
      return validation;
    }
    if (Array.isArray(value) && value.length > 0) {
      return validation;
    }
    return yup.mixed().notRequired();
  });

export const stringValidation = (label, length = 2) =>
  yup
    .string()
    .trim()
    .label(label)
    .min(length, `${label} should be more than ${length - 1} characters`)
    .required(`${label} is required`);

export const email = yup
  .string()
  .label('Email')
  .email('Seems like an invalid email address')
  .required('Email is required');

export const password = yup
  .string()
  .label('Password')
  .required('Password is required');

export const strongPassword = password.min(6, 'Seems a bit short...');

export const confirmPassword = yup
  .string()
  .label('Confirm Password')
  .required('Enter your password again')
  .oneOf([yup.ref('password')], 'Passwords must match');

export const phoneNumber = yup
  .string()
  .label('Phone')
  .min(6, `Only mobile is allowed. It should be more than 5 characters`)
  .max(14, `Only mobile is allowed. It should be less than 14 characters`)
  .required('Phone is required');

export const OptionalPhoneNumber = optionalValidation(phoneNumber);

export const positiveNumberValidation = (label, type = 'number') =>
  yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required(`${label} must be a valid ${type}`)
    .positive(`${label} must be a positive ${type}`);

export const numberValidation = (label, type = 'number') =>
  yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required(`${label} must be a valid ${type}`)
    .integer(`${label} must be a ${type}`);

export const percentageValidation = (label, type = 'number') =>
  yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required(`${label} must be a valid ${type}`)
    .positive(`${label} must be a positive ${type}`)
    .integer(`${label} must be a ${type}`)
    .max(100, `${label} must be lesser than 100`);

export const moneyRange = (
  label,
  type = 'number',
  min,
  max = 0,
  isMoneyFormat = true
) =>
  yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required(`${label} must be a valid ${type}`)
    .positive(`${label} must be a positive ${type}`)
    .min(
      min,
      `${label} must be greater than ${
        isMoneyFormat ? moneyFormatInNaira(min) : min
      }`
    )
    .max(
      max,
      `${label} must be lesser than ${
        isMoneyFormat ? moneyFormatInNaira(max) : max
      }`
    );

export const numberRange = (label, type = 'number', min, max = 0) =>
  moneyRange(label, type, min, max, false);

export const validPercentage = (label) =>
  yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required(`${label} must be a valid percentage`)
    .positive(`${label} must be a positive percentage`)
    .min(0, `${label} must be greater than 0%`)
    .max(100, `${label} must be lesser than 100%`);

export const requiredDate = (label) =>
  yup
    .object()
    .transform((value, originalValue) => {
      return (
        (value?.date && { date: parseISO(value.date) }) ||
        (originalValue && { date: parseISO(originalValue) }) || {
          date: undefined,
        }
      );
    })
    .shape({
      date: yup.date().required(`${label} is required`),
    });

export const yearValidation = (label) =>
  yup
    .number(`${label} must be a number`)
    .positive(`${label} must be a valid year`)
    .integer(`${label} must be a valid year`);

export const minDateValidation = (label, minDate) =>
  yup
    .object()
    .transform((value, originalValue) => {
      return (
        (value?.date && { date: parseISO(value.date) }) ||
        (originalValue && { date: parseISO(originalValue) }) || {
          date: undefined,
        }
      );
    })
    .shape({
      date: yup
        .date()
        .required(`${label} is required`)
        .min(minDate, `${label} must be greater than ${minDate}`),
    });
export const autocompleteValidation = (label, minSelection = 1) =>
  yup
    .array()
    .min(minSelection, `Kindly select ${minSelection} or more items`)
    .of(
      yup.object().shape({
        id: yup.number(),
        name: yup.string().required(),
      })
    );

export const urlValidation = (label) =>
  yup
    .string()
    .label(label)
    .url('Must be a valid url')
    .required(`${label} is required`);

export const lengthValidation = (label, length = 10) =>
  yup
    .string()
    .matches(/^[0-9]*$/, `${label} must contain numbers only`)
    .length(length, `Must be exactly ${length} character`);
// .number()
// .label(label)
// .test('len', `Must be exactly ${length} characters`, val => {
//   return val.length === length;
// });
// yup.string().transform((_, originalValue) => {
//   // return typeof originalValue === 'string' ? originalValue : null;
// });
// yup.lazy(value => {
//   if (value !== undefined) {
//     return yup.object().shape({
//       otherData: yup.string().required()
//     });
//   }
//   return yup.mixed().notRequired();
// });

export const createSchema = (object) => {
  return yup.object().shape(object);
};

export const arrayValidation = (label) => yup.array().label(label);

export const customSelectValidation = (label) =>
  yup.lazy((val) =>
    Array.isArray(val)
      ? yup
          .array()
          .label(label)
          .min(1, `You must select at least one ${label}.`)
          .of(yup.string().required())
      : yup.string(label).nullable()
  );

export const multiSelectValidation = (label) =>
  yup
    .array()
    .label(label)
    .min(1, `Tip: you can select more than one ${label}.`)
    .of(yup.string().required());

export const defaultValidation = (label, defaultValue) =>
  yup.string().label(label).default(defaultValue);

export const addressSchema = {
  street1: stringValidation('Street Line 1'),
  street2: optionalValidation(stringValidation('Street Line 2', 2)),
  city: required('City'),
  state: required('State'),
  country: defaultValidation('Country', 'Nigeria'),
};
