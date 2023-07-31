import { stringValidation } from './schema-helpers';

export const searchSchema = {
  term: stringValidation('Search Term'),
};
