import store from 'store2';

const PREFIX = 'ballers';
const TOKEN = `${PREFIX}-token`;
const USER_TYPE = `${PREFIX}-user-type`;
const FIRST_NAME = `${PREFIX}-first-name`;
const PROPERTY_IMAGE = `${PREFIX}-property-image`;
const REFERRAL_INFO = `${PREFIX}-referral-info`;
const TOUR_VALUE = `${PREFIX}-tour-value`;

// Token
export const storeToken = (token) => store(TOKEN, token);
export const getTokenFromStore = () => store(TOKEN);

// User Role
export const storeUserRole = (type) => store(USER_TYPE, type);
export const getUserRoleFromStore = () =>
  store(USER_TYPE) || store(USER_TYPE) === 0 ? store(USER_TYPE) : '1';

// UserFirstName
export const storeUserFirstName = (firstName) => store(FIRST_NAME, firstName);
export const getUserFirstName = () => store(FIRST_NAME);

// Property Image
export const storePropertyImage = (image) => store(PROPERTY_IMAGE, image);
export const getPropertyImage = () => store(PROPERTY_IMAGE);
export const removePropertyImage = () => store.remove(PROPERTY_IMAGE);

// Tour
export const storeTourValue = () => store(TOUR_VALUE, 'FINISHED');
export const getTourValue = () => store(TOUR_VALUE);
export const removeTourValue = () => store.remove(TOUR_VALUE);

// Referral Info
export const storeReferralInfo = (referralInfo) =>
  store(REFERRAL_INFO, referralInfo);
export const getReferralInfo = () => store(REFERRAL_INFO);
export const removeReferralInfo = () => store.remove(REFERRAL_INFO);

// Clear Storage
export const clearStorage = () => store(false);
