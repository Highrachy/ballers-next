import { optionalValidation, stringValidation } from './schema-helpers';

export const blogPostSchema = {
  title: stringValidation('Title'),
  content: stringValidation('Content'),
  mainImage: stringValidation('Main Image'),
  category: stringValidation('Category'),
  tags: optionalValidation(stringValidation('Tags')),
};

export const searchSchema = {
  term: stringValidation('Search Term'),
};

export const blogCommentSchema = {
  author: stringValidation('Author'),
  content: stringValidation('Content'),
};
