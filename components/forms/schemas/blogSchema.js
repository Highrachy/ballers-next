import {
  arrayValidation,
  optionalValidation,
  stringValidation,
} from './schema-helpers';

export const blogPostSchema = {
  title: stringValidation('Title'),
  content: stringValidation('Content'),
  mainImage: optionalValidation(stringValidation('Main Image')),
  category: stringValidation('Category'),
  tags: optionalValidation(arrayValidation('Tags')),
  status: stringValidation('Status'),
};

export const searchSchema = {
  term: stringValidation('Search Term'),
};

export const blogCommentSchema = {
  author: stringValidation('Author'),
  content: stringValidation('Content'),
};
