import * as yup from 'yup';
import { stringValidation, numberValidation, required } from './schema-helpers';

export const createCommunitySchema = {
  title: stringValidation('Title'),
  category: stringValidation('Category'),
  content: stringValidation('Content'),
};

export const communityCommentSchema = {
  content: stringValidation('Content'),
};
