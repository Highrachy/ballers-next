import {
  stringValidation,
  positiveNumberValidation,
  email,
  phoneNumber,
  minDateValidation,
  required,
  optionalValidation,
  autocompleteValidation,
  percentageValidation,
} from './schema-helpers';

export const newPropertySchema = {
  name: stringValidation('Property Name'),
  price: positiveNumberValidation('Price'),
  units: positiveNumberValidation('Units'),
  houseType: stringValidation('House Type'),
  bedrooms: positiveNumberValidation('Bedrooms'),
  bathrooms: positiveNumberValidation('Bathrooms'),
  toilets: positiveNumberValidation('Toilets'),
  description: stringValidation('Description'),
  titleDocument: optionalValidation(required('Title Document')),
  features: optionalValidation(autocompleteValidation('Available for')),
  pricingModel: optionalValidation(required('Pricing Model')),
  deliveryState: optionalValidation(required('Delivery State')),
  // floorPlans: optionalValidation(required('Floor Plans')),
  // mapLocation: optionalValidation(required('Map Location')),
  // neighborhood: Joi.array().label('Property neighborhood').optional(),
  // gallery: Joi.array().label('Property gallery').optional(),
};

export const scheduleTourSchema = {
  visitorName: stringValidation('Visitor Name'),
  visitorEmail: email,
  visitorPhone: phoneNumber,
  visitDate: minDateValidation('Visitation Date', new Date()),
};

export const updateScheduleTourSchema = {
  reason: stringValidation('Reason'),
  visitDate: minDateValidation('Visitation Date', new Date()),
};

export const cancelScheduleTourSchema = {
  reason: stringValidation('Reason'),
};

export const addAreaSchema = {
  area: required('Area'),
  state: required('State'),
};

export const addContentPropertySchema = {
  areaId: required('Area Id'),
  category: required('Category'),
  houseType: required('Property Type'),
  price: required('Price'),
  website: optionalValidation(required('Website')),
  link: optionalValidation(required('Link')),
};
export const uploadContentPropertySchema = {
  areaId: required('Area Id'),
  state: required('State'),
};

export const addGallerySchema = {
  title: required('Title'),
};

export const addVideoSchema = {
  title: required('Title'),
  url: required('Video URL'),
};

export const updateMilestoneSchema = {
  title: required('Title'),
  description: optionalValidation(required('Milestone Description')),
  percentage: percentageValidation('Percentage'),
};

export const addMilestoneSchema = {
  ...updateMilestoneSchema,
  addAfter: optionalValidation(required('Add After')),
};

export const addFloorPlansSchema = {
  name: required('Title'),
};

export const neighborhoodTypeSchema = {
  type: required('Type'),
};

export const neighborhoodSchema = {
  distance: optionalValidation(required('Distance')),
  name: optionalValidation(required('Name')),
};

export const reportPropertySchema = {
  reason: required('Reason'),
};

export const flagPropertySchema = {
  reason: required('Reason'),
  notes: optionalValidation(required('Notes')),
};

export const unflagPropertySchema = {
  reason: required('Reason'),
};

export const resolveFlagPropertySchema = {
  comment: required('Comment'),
};

export const requestVideoReviewSchema = {
  comment: required('Comment'),
};

export const addTestimonialSchema = {
  testimonial: required('Testimonial'),
};

export const replyTestimonialSchema = {
  response: required('Response'),
};

export const searchPropertySchema = {
  all: stringValidation('Search Term', 3),
};

export const addPropertyUpdateSchema = {
  title: required('Title'),
  description: optionalValidation(required('Progress Report Description')),
};

export const propertyUpdateImageSchema = {
  title: required('Title'),
  url: required('Image URL'),
};
