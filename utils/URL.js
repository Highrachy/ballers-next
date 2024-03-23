import { BASE_API_URL } from 'utils/constants';

export const API_ENDPOINT = {
  getOneProperty: (id) => `${BASE_API_URL}/property/${id}`,
  getAllProperties: () => `${BASE_API_URL}/property/all?limit=0`,
  getPropertyBySlug: (slug) => `${BASE_API_URL}/property/all?slug=${slug}`,
  searchProperties: () => `${BASE_API_URL}/property/search`,

  getOnePortfolio: (id) => `${BASE_API_URL}/property/portfolio/${id}`,
  getAllPortfolios: () => `${BASE_API_URL}/property/portfolio/all`,

  getOneUser: (id) => `${BASE_API_URL}/user/${id}`,
  getAllUsers: () => `${BASE_API_URL}/user/all`,

  getOneEnquiry: (id) => `${BASE_API_URL}/enquiry/${id}`,
  getAllEnquiries: () => `${BASE_API_URL}/enquiry/all`,

  getOneOffer: (id) => `${BASE_API_URL}/offer/${id}`,
  getAllOffers: () => `${BASE_API_URL}/offer/all`,

  getOneOfferTemplate: (id) => `${BASE_API_URL}/offer/template/${id}`,
  getAllOfferTemplates: () => `${BASE_API_URL}/offer/template/all`,

  getOnePropertyTemplate: (id) => `${BASE_API_URL}/property/template/${id}`,
  getAllPropertyTemplates: () => `${BASE_API_URL}/property/template/all`,

  getOneTransaction: (id) => `${BASE_API_URL}/transaction/${id}`,
  getAllTransactions: () => `${BASE_API_URL}/transaction/all`,

  getOneVisitation: (id) => `${BASE_API_URL}/visitation/${id}`,
  getAllVisitations: () => `${BASE_API_URL}/visitation/all`,

  getAllOfflinePayments: () => `${BASE_API_URL}/offline-payment/all`,

  getAccountOverview: () => `${BASE_API_URL}/user/account-overview`,

  getAllNotifications: () => `${BASE_API_URL}/notification/all`,

  getAllStates: () => `${BASE_API_URL}/area/states`,
  getAllContentProperty: () => `${BASE_API_URL}/area/all`,

  getDashboardCount: () => `${BASE_API_URL}/total-count`,

  getAllReportedProperties: () => `${BASE_API_URL}/report-property/all`,
  getAllReferrals: () => `${BASE_API_URL}/referral/all`,

  getAllBadges: () => `${BASE_API_URL}/badge/all`,
  getOneBadge: (id) => `${BASE_API_URL}/badge/${id}`,
  getAllBadgesByRole: (role) => `${BASE_API_URL}/badge/all/role/${role}`,

  getAllAssignedBadges: () => `${BASE_API_URL}/assign-badge/all`,

  getAllBankAccounts: () => `${BASE_API_URL}/bank-account/all`,

  getAllPropertyVideos: () => `${BASE_API_URL}/property-video/all`,
  getAllPropertyTestimonials: () => `${BASE_API_URL}/property/testimonial/all`,

  getAllVas: () => `${BASE_API_URL}/vas/all`,
  getOneVas: (id) => `${BASE_API_URL}/vas/${id}`,
  getAllVasRequests: () => `${BASE_API_URL}/vas/request/all`,
  getOneVasRequest: (id) => `${BASE_API_URL}/vas/request/${id}`,

  getAllCommunityTopics: () => `${BASE_API_URL}/community/all`,
  getOneCommunityTopic: (id) => `${BASE_API_URL}/community/${id}`,
  getCommunityBySlug: (slug) => `${BASE_API_URL}/community/all?slug=${slug}`,

  getVendor: (slug) => `${BASE_API_URL}/user/vendor/${slug}`,
  getAllVendors: () => `${BASE_API_URL}/user/vendors`,

  getDashboardInfo: () => `${BASE_API_URL}/user/dashboard`,
};
