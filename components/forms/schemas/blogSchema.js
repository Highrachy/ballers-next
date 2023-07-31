import { stringValidation } from './schema-helpers';

export const searchSchema = {
  term: stringValidation('Search Term'),
};

export const blogCommentSchema = {
  author: stringValidation('Author'),
  content: stringValidation('Content'),
};
