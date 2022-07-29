import { stringValidation, positiveNumberValidation } from './schema-helpers';

export const addVasSchema = {
  name: stringValidation('Name'),
  description: stringValidation('Description'),
  price: positiveNumberValidation('Price'),
  type: stringValidation('Type'),
};

export const vasRequestSchema = {
  vasId: stringValidation('VAS Id'),
};
