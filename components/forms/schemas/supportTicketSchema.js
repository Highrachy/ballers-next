import * as Yup from 'yup';
import { OptionalPhoneNumber, email, stringValidation } from './schema-helpers';

export const addSupportTicketSchema = {
  subject: stringValidation('Subject'),
  description: stringValidation('Description'),
  priority: stringValidation('Priority'),
};

export const addAnonymousSupportTicketSchema = {
  ...addSupportTicketSchema,
  anonymousUser: Yup.object().shape({
    fullName: stringValidation('Full Name'),
    email,
    phone: OptionalPhoneNumber,
  }),
};
