import { required } from './schema-helpers';

export const addBadgesSchema = {
  name: required('Name'),
  assignedRole: required('Role'),
};
