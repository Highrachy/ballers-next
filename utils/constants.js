export const OFFICE_LOCATION = { lat: 6.4297284, lng: 3.4297021 };
export const BASE_API_URL = !!process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : 'https://staging-ballers-api.herokuapp.com/api/v1';

export const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL || 'https://appstaging.ballers.ng/wp/graphql';

export const USER_TYPES = {
  admin: 0,
  user: 1,
  vendor: 2,
  editor: 3,
};

export const USER_ROLE = USER_TYPES;

export const DASHBOARD_PAGE = {
  [USER_TYPES.user]: 'user',
  [USER_TYPES.admin]: 'admin',
  [USER_TYPES.vendor]: 'vendor',
  [USER_TYPES.editor]: 'editor',
};

export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

export const COLOR_STYLE = [
  'none',
  'primary',
  'secondary',
  'primary-light',
  'secondary-light',
  'success',
  'success-light',
  'danger',
  'danger-light',
  'pink-light',
  'purple-light',
  'error',
  'warning',
  'warning-light',
  'info',
  'info-light',
  'gray-light',
  'light',
  'dark',
];

export const TITLE_DOCUMENTS = [
  'Certificate of Occupancy',
  'Deed of Assignment',
  'Deed of Conveyance',
  'Deed of Lease',
  'Deed of Sublease',
  'Land Certificate',
];

export const FAST_TRACK_VENDOR = {
  AUTO: 'AUTO',
  REQUIRE_INFO: 'REQUIRE INFO',
  COMPLETED: 'COMPLETED',
  NONE: 'NONE',
};

export const MALE_TITLES = ['Mr.', 'Master', 'Chief (Mr)', 'Alhaji'];
export const FEMALE_TITLES = ['Mrs.', 'Ms.', 'Miss', 'Chief (Mrs)', 'Alhaja'];
export const TITLES = [...MALE_TITLES, ...FEMALE_TITLES].sort();

export const MOBILE_WIDTH = 576;

export const HOUSE_TYPES = [
  'Bungalow',
  'Detached Duplex',
  'Flat',
  'Maisonette',
  'Penthouse',
  'Semi-detached Bungalow',
  'Semi-detached Duplex',
  'Studio Apartment',
  'Terraced Bungalow',
  'Terraced Duplex',
];

export const PRICING_MODEL = {
  Timeline: 'Timeline',
  Milestone: 'Milestone',
};

export const PRICING_MODEL_DESC = {
  Timeline: 'Timeline',
  Milestone: 'Milestone',
};

export const PROPERTY_DELIVERY_STATE = {
  Carcass: 'Carcass',
  Shell: 'Shell',
  Completed: 'Completed',
  Fitted: 'Fitted',
  Furnished: 'Furnished',
};

// CONVERT HOUSE TYPES TO A single object

export const ALL_HOUSE_TYPES = HOUSE_TYPES.reduce((acc, type) => {
  acc[type] = type;
  return acc;
}, {});

export const REFERRAL_STATUS = {
  Sent: {
    text: 'Invite Sent',
    className: 'text-danger',
  },
  Registered: {
    text: 'Registered',
    className: 'text-warning',
  },
  Rewarded: {
    text: 'Rewarded',
    className: 'text-success',
  },
};

export const REWARD_STATUS = {
  Pending: {
    text: 'Pending',
    className: 'text-danger',
  },
  Started: {
    text: 'Offer Signed',
    className: 'text-success',
  },
  'Payment Started': {
    text: 'Property Payment Started',
    className: 'text-success',
  },
  'Payment In Progress': {
    text: 'Property Payment In Progress',
    className: 'text-success',
  },
  'Payment Completed': {
    text: 'Processing Reward',
    className: 'text-success',
  },
  'Referral Paid': {
    text: 'Referral Reward Paid',
    className: 'text-success',
  },
};

export const OFFER_TEMPLATE_STATUS = {
  APPROVED: 'Approved',
  CREATED: 'Created',
};

export const OFFER_STATUS = {
  GENERATED: 'Generated', // Offer has been created by vendor
  INTERESTED: 'Interested', // Offer has been signed by the user, no payment has been made yet
  ASSIGNED: 'Assigned', //  A minimum of first Payment has been made on the Offer
  PRE_ASSIGNED: 'Pre Assigned',
  ALLOCATED: 'Allocated', // User has reached the allocated threshold
  PRE_ALLOCATED: 'Pre Allocated',
  REACTIVATED: 'Reactivated', // Same as Expired, just informing us that a new offer was created from this.
  CANCELLED: 'Cancelled', // Vendor cancels the offer
  PRE_CANCELLED: 'Pre Cancelled', // Payment has been made on offer, but vendor wants to cancel offer
  COMPLETED_PAYMENT: 'Completed Payment',
  PENDING_ADMIN_APPROVAL: 'Pending Admin Approval',
  PENDING_VENDOR_REVIEW: 'Pending Vendor Review',
  EXPIRED: 'Expired', // Newly added for automatically expired offers
};

export const ACTIVE_OFFER_STATUS = [
  OFFER_STATUS.INTERESTED,
  OFFER_STATUS.ASSIGNED,
  OFFER_STATUS.PRE_ASSIGNED,
  OFFER_STATUS.PRE_ALLOCATED,
  OFFER_STATUS.ALLOCATED,
];

export const VALID_PORTFOLIO_OFFER = [
  OFFER_STATUS.INTERESTED,
  OFFER_STATUS.ASSIGNED,
  OFFER_STATUS.PRE_ASSIGNED,
  OFFER_STATUS.PRE_ALLOCATED,
  OFFER_STATUS.ALLOCATED,
  OFFER_STATUS.COMPLETED_PAYMENT,
];

export const OWNED_PROPERTY_OFFER = [
  OFFER_STATUS.PRE_ASSIGNED,
  OFFER_STATUS.PRE_ALLOCATED,
  OFFER_STATUS.ASSIGNED,
  OFFER_STATUS.ALLOCATED,
  OFFER_STATUS.COMPLETED_PAYMENT,
];

export const PENDING_OFFER = [
  OFFER_STATUS.GENERATED,
  OFFER_STATUS.PENDING_ADMIN_APPROVAL,
  OFFER_STATUS.PENDING_VENDOR_REVIEW,
];

export const INVALID_OFFER = [
  OFFER_STATUS.CANCELLED,
  OFFER_STATUS.EXPIRED,
  OFFER_STATUS.REACTIVATED,
];

export const ACTIVE_PORTFOLIO_OFFER = [
  OFFER_STATUS.GENERATED,
  ...VALID_PORTFOLIO_OFFER,
];

export const STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT - Abuja',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

export const VENDOR_IDENTIFICATION_TYPE = {
  'Limited Liability Company': 'Incorporation Document',
  'Registered Company Name': 'Company Registration Document',
  Individual: 'Valid Identification',
};

export const ENTITY_SHORTCODE = {
  None: 'Pending',
  'Limited Liability Company': 'LLC',
  'Registered Company Name': 'RCN',
  Individual: 'Individual',
};

export const INDIVIDUAL_IDENTIFICATION_TYPE = [
  'Drivers License',
  'International Passport',
  'National Identification Card',
];

export const VENDOR_STEPS = {
  companyInfo: 'Company Information',
  bankDetails: 'Bank Details',
  directorInfo: 'Directors Information',
  documentUpload: 'Document Upload',
};

export const STATUS = {
  Pending: 'Pending',
  Resolved: 'Resolved',
};

export const VENDOR_VERIFICATION_STATUS = {
  NOT_STARTED: 'No Submitted Information',
  PENDING_COMMENTS: 'Pending Comments',
  IN_REVIEW: 'Currently In Review',
  AWAITING_INFO: 'Awaiting Information',
};

export const VENDOR_INFO_STATUS = ['Pending', 'Verified', 'In Review'];

export const DEFAULT_PROPERTY_FEATURES = [
  'Car Parking',
  'Guest Toilet',
  'Guest Room',
  "Governor's Consent",
  'Electricity',
  'Paved Roads',
  'Perimeter Fence',
  'Portable Water',
  'Fully Tiled',
  'Ensuite Rooms',
  'Easy Access to Roads',
];

export const ALL_PROPERTY_FEATURES = [
  ...DEFAULT_PROPERTY_FEATURES,
  'Cable TV Distibution',
  'Core Fiber Internet',
  'Inverter System',
  'Security Fence',
  'Parking Lot',
  'Dedicated Car Port',
  'Maid Room',
  'Surveillance System',
  'Smart Solar System',
  'Panic Alarm',
  'Intercom System',
  'Spacious Kitchen',
  'Video door phone',
  'Fire detection',
  'Swimming Pool',
  'Rooftop Gym',
  'Garage',
  'Free WiFi',
  'Peaceful Environment',
  'Fitted Kitchen',
];

export const NEIGHBORHOOD_STEPS = [
  'entertainments',
  'hospitals',
  'pointsOfInterest',
  'restaurantsAndBars',
  'schools',
  'shoppingMalls',
];

export const VISITATION_STATUS = {
  CANCELLED: 'Cancelled',
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
};

export const PAYMENT_FREQUENCY = {
  0: 'Outright Payment',
  7: '7 days',
  30: '30 days',
  90: '90 days',
  180: '180 days',
};

export const PAYMENT_OPTION = {
  EVENLY_DISTRIBUTED: 'Evenly Distributed',
  FINAL_DEPOSIT: 'Final Deposit',
  INITIAL_DEPOSIT: 'Initial Deposit',
};

export const PAYMENT_OPTIONS_BREAKDOWN = {
  [PAYMENT_OPTION.INITIAL_DEPOSIT]: 'Additional charges at initial deposit',
  [PAYMENT_OPTION.EVENLY_DISTRIBUTED]: 'Additional payment evenly distributed',
  [PAYMENT_OPTION.FINAL_DEPOSIT]: 'Additional payment at final deposit',
};

export const NOTIFICATION_TYPE = {
  0: 'danger',
  1: 'text',
  2: 'info',
  3: 'success',
};

export const DEFAULT_VENDOR_PERCENTAGE = 5;

export const NOTIFICATION_ACTION = {
  ENQUIRY: 'ENQUIRY',
  OFFLINE_PAYMENT: 'OFFLINE_PAYMENT',
  OFFER: 'OFFER',
  PROPERTY: 'PROPERTY',
  TRANSACTION: 'PAYMENT',
  USER: 'USER',
  VISITATION: 'VISITATION',
};

export const BADGE_ACCESS_LEVEL = {
  ALL: -1,
  USER: USER_TYPES.user,
  VENDOR: USER_TYPES.vendor,
};

export const PROPERTY_VIDEO_STATUS = {
  APPROVED: 'Approved',
  DISAPPROVED: 'Disapproved',
  PENDING_ADMIN_REVIEW: 'Pending Admin Review',
};

export const VAS_TYPE = {
  PROPERTY: 'Property', // PROPERTY ON BALL
  GENERAL: 'General', // DEALING WITH USER DIRECTLY
};

export const VAS_ROLE_TYPE = {
  ALL: -1,
  USER: USER_ROLE.user,
  VENDOR: USER_ROLE.vendor,
};

export const VAS_ROLE = {
  [VAS_ROLE_TYPE.ALL]: 'Everyone',
  [VAS_ROLE_TYPE.USER]: 'Homebuyer',
  [VAS_ROLE_TYPE.VENDOR]: 'BALL VIP',
};

export const MODEL = {
  OFFER: 'offers',
  VAS_REQUEST: 'vasrequests',
  WALLET: 'wallet',
};

export const SOCIAL_MEDIA = {
  facebook: 'https://www.facebook.com/Highrachy/',
  twitter: 'https://twitter.com/highrachy',
  instagram: 'https://www.instagram.com/highrachyhq/',
  linkedin:
    'https://www.linkedin.com/company/highrachy-investment-and-technology-limited',
};

export const MILESTONE_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const PROPERTY_UPDATE_MEDIA_STATUS = {
  UPLOADED: 'UPLOADED',
  MILESTONE_APPROVED: 'MILESTONE_APPROVED',
  ADMIN_APPROVED: 'ADMIN_APPROVED',
};

export const FEATURE_FLAG_LIST = {
  wallet: 'Wallet Implementation',
  tour: 'Tour Calendar',
};

export const FEATURE_FLAGS = Object.values(FEATURE_FLAG_LIST);

export const isFeatureFlagEnabled = (featureFlagsArray, flagName) => {
  const flag = featureFlagsArray.find((flag) => flag.name === flagName);

  return flag && flag.status === true;
};

export const SUPPORT_TICKET_STATUS = {
  NEW: 'new',
  OPEN: 'open',
  PENDING: 'pending',
  ON_HOLD: 'on-hold',
  SOLVED: 'solved',
  CLOSED: 'closed',
};

export const BALL_COMMUNITY_CATEGORY = [
  'Real Estate',
  'Technology',
  'Education',
  'Lifestyle',
  'Business',
  'BALL Platform',
  'Others',
].sort();

export const EDITOR_MENU = {
  LITE: 'lite',
  COMPACT: 'compact',
  NORMAL: 'normal',
  FULL: 'full',
};
