export const KUDI_SMS_API = 'https://account.kudisms.net/api/';

export const buildKudiSMSActionUrl = (action = 'balance') =>
  `${KUDI_SMS_API}?username=${process.env.NEXT_PUBLIC_KUDI_SMS_USERNAME}&password=${process.env.NEXT_PUBLIC_KUDI_SMS_PASSWORD}&action=${action}`;
