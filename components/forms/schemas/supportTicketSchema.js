import * as Yup from 'yup';
import {
  OptionalPhoneNumber,
  email,
  required,
  stringValidation,
} from './schema-helpers';

export const addSupportTicketSchema = {
  subject: stringValidation('Subject'),
  description: stringValidation('Description'),
  priority: stringValidation('Priority'),
  captchaToken: required('Please verify you are not a robot'),
};

export const addAnonymousSupportTicketSchema = {
  ...addSupportTicketSchema,
  anonymousUser: Yup.object().shape({
    fullName: stringValidation('Full Name'),
    email,
    phone: OptionalPhoneNumber,
  }),
};
