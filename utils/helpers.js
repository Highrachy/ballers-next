import React from 'react';
import Humanize from 'humanize-plus';
import Converter from 'number-to-words';
import {
  MALE_TITLES,
  FEMALE_TITLES,
  REFERRAL_STATUS,
  REWARD_STATUS,
} from './constants';

export const commaNumber = (
  value,
  prependCurrency = false,
  showDecimal = false
) => {
  const number = Math.round(value * 100) / 100;
  const currency = prependCurrency ? '₦ ' : '';
  const sign = number < 0 ? '— ' : '';
  return `${sign}${currency}${
    showDecimal
      ? Math.abs(number).toFixed(2)
      : Humanize.intComma(Math.abs(number))
  }`;
};

export const moneyFormat = (value) => Humanize.formatNumber(value, 2);
export const moneyFormatInNaira = (value, showDecimal = false) =>
  commaNumber(value, true, showDecimal);

export const moneyFormatElement = (value) => (
  <>
    <span className="money__amount-in-naira">{Humanize.intComma(value)}</span>
    <small className="money__amount-in-kobo">
      .{(value % 1).toFixed(2) * 100 || '00'}
    </small>
  </>
);

export const listJsonItems = (items, defaultValue = null) => {
  try {
    const parsedItems = JSON.parse(items);
    if (!parsedItems) return defaultValue;
    if (parsedItems.length <= 1) return parsedItems;
    return parsedItems.join(', ');
  } catch (error) {
    return defaultValue;
  }
};

export const dashedLowerCase = (text) =>
  text && text.toString().replace(/\s+/g, '-').toLowerCase();

export const getItems = (items, end) => {
  if (items == null) return items;
  // The slice() method returns a shallow copy of a portion of an array into a new array object selected from begin to end (end not included). The original array will not be modified.
  return items.slice(0, end);
};

export const numToWords = (num) => Humanize.titleCase(Converter.toWords(num));
export const numToOrdinal = (num) =>
  Humanize.titleCase(Converter.toWordsOrdinal(num));

export const getPercentage = (value) => parseFloat(value) / 100;
export const getNairaSymbol = () => <>&#8358;</>;
export const ONE_MILLION = 1000000;
export const nearestMillion = (value) =>
  moneyFormatInNaira(Math.round(value / ONE_MILLION) * ONE_MILLION);

export const isDevEnvironment = () =>
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const getProxy = () =>
  isDevEnvironment() ? 'http://localhost:8080' : '';

export const getDemoRegisterLink = () =>
  isDevEnvironment()
    ? '/create-demo-account'
    : 'https://preview.ballers.ng/create-demo-account';

export const getDemoLoginLink = () =>
  isDevEnvironment() ? '/login' : 'https://preview.ballers.ng/login';

export const getError = (error) =>
  error?.response?.data
    ? JSON.stringify(error?.response?.data?.error) ||
      JSON.stringify(error?.response?.data?.message) ||
      JSON.stringify(error)
    : 'An error has occured. Please try again later.';

export const generateNumOptions = (number = 12, type = '', options = {}) => {
  const startFrom =
    options.startFrom || options.startFrom === 0 ? options.startFrom : 1;
  const firstMonthText = options.firstMonthText;
  const pluralizeText = !options?.noPluralText;

  return [...Array(number).keys()].map((value) => {
    const num = value + startFrom;
    return {
      value: num.toString(),
      label:
        num.toString() === startFrom.toString() && firstMonthText
          ? firstMonthText
          : `${num} ${pluralizeText ? Humanize.pluralize(num, type) : type}`,
    };
  });
};

export const generateBudgetOptions = (options) => {
  const start = options.start || 5;
  const end = options.end || 30;
  const defaultValue = options.defaultValue || 0;
  const showBlankOption = options.showBlankOption || false;

  const blankOption = [
    { value: defaultValue.toString(), label: 'Not Applicable' },
  ];
  const budget = [...Array(end - start).keys()].map((value) => {
    const num = value + start;
    return {
      value: (num * ONE_MILLION).toString(),
      label: `${num.toString()} Million Naira`,
    };
  });

  return showBlankOption ? [...blankOption, ...budget] : budget;
};

export const setAutoComplete = (lists) =>
  lists.map((list, id) => ({ id, name: list }));
export const getAutoComplete = (lists) => lists.map(({ name }) => name);

export const valuesToOptions = (values, defaultLabel = null) => {
  const output = values.map((value) => ({
    value: value.toString(),
    label: Humanize.titleCase(value.toString()),
  }));

  return defaultLabel
    ? [{ value: '', label: defaultLabel }, ...output]
    : output;
};

export const objectToOptions = (obj, defaultLabel = null, inverse = false) => {
  const output = Object.entries(obj).map(([label, value]) => ({
    value: inverse ? label.toString() : value.toString(),
    label: inverse
      ? Humanize.titleCase(value.toString())
      : Humanize.titleCase(label.toString()),
  }));

  return defaultLabel
    ? [{ value: '', label: defaultLabel }, ...output]
    : output;
};

export const dataToOptions = (data, label, value = '_id') => {
  if (!data) return null;
  const output = Object.values(data).map((item) => ({
    value: item[value],
    label: item[label],
  }));

  return output;
};

export const booleanOptions = (trueLabel = 'Yes', falseLabel = 'No') => [
  { label: trueLabel, value: 'true' },
  { label: falseLabel, value: 'false' },
];

export const getGenderFromTitle = (title) => {
  if (MALE_TITLES.includes(title)) return 'Sir';
  if (FEMALE_TITLES.includes(title)) return 'Ma';
  return 'Sir/Ma';
};

export const getLocationFromAddress = (address, hideFullStop = false) => {
  if (!address) return null;
  let output = '';
  if (address.street1) {
    output += address.street1.trim();

    if (address.street2) {
      output += `, ${address.street2.trim()}`;
    }

    if (address.city) {
      output += `, ${address.city.trim()}`;
    }

    if (address.state) {
      output += `, ${address.state.trim()}${hideFullStop ? '' : '.'}`;
    }
  }
  return output.replaceAll(',,', ',');
};

export const getFormattedAddress = ({
  street1,
  street2,
  city,
  state,
  country,
  hideCountry,
}) => (
  <address>
    {street1}
    <br />
    {street2 && (
      <>
        {street2} <br />{' '}
      </>
    )}
    {city || 'Lekki'}, {state || 'Lagos'}
    {!hideCountry && (
      <>
        <br />
        {country}.
      </>
    )}
  </address>
);

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const isValidURL2 = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
};

export const statusIsSuccessful = (status) => status >= 200 && status <= 204;

export const getUserTitle = (title) => {
  if (MALE_TITLES.includes(title)) {
    return 'Sir';
  }
  if (FEMALE_TITLES.includes(title)) {
    return 'Ma';
  }
  return 'Sir/Ma';
};

// Manual Waiting
//  manualWait(() => {
//   setCommentLoading(null);
// }, 3000);
export const manualWait = async (func, delay = 1000) =>
  await new Promise((resolve) =>
    setTimeout(() => {
      func();
      resolve();
    }, delay)
  );

// Helpers for Filters
export const getTitleCase = (name) => (name ? Humanize.titleCase(name) : '');
export const formatFilterString = (name, value) =>
  `${name}: ${getTitleCase(value)}`;
export const formatFilterBoolean = (
  name,
  value,
  trueValue = 'Yes',
  falseValue = 'No'
) => `${name}: ${value && value === 'true' ? trueValue : falseValue}`;

export const formatFilterPrice = (price) =>
  price && Number(price) ? moneyFormatInNaira(price) : '';

export const getRange = (value, format) => {
  const prefix = format?.prefix ? `${format?.prefix} ` : '';
  const suffix = format?.suffix ? ` ${format?.suffix}` : '';
  return Array.isArray(value)
    ? `${prefix}${value?.[0] || 0}${suffix}:${prefix}${
        value?.[1] || 0
      }${suffix}`
    : `${prefix}${value}${suffix}`;
};

export const getReferralStatus = (referralStatus, rewardStatus) => {
  if (
    referralStatus === REFERRAL_STATUS.Registered.text &&
    rewardStatus === REWARD_STATUS.Pending.text
  ) {
    return REFERRAL_STATUS.Registered;
  }

  if (
    rewardStatus !== REWARD_STATUS.Pending.text &&
    REWARD_STATUS[rewardStatus]
  ) {
    return REWARD_STATUS[rewardStatus];
  }

  return REFERRAL_STATUS.Sent;
};

export const formatInDays = (num) => `${num} ${Humanize.pluralize(num, 'day')}`;

export const flattenErrorMessages = (obj, result = []) => {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === 'object') {
      flattenErrorMessages(value, result);
    } else {
      result.push(value);
    }
  });
  return result;
};

export const generateYearsArray = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1960;
  const yearsArray = [];

  for (let year = currentYear; year >= startYear; year--) {
    yearsArray.push(year);
  }

  return yearsArray;
};

export const convertToNormalCase = (str) => {
  if (!str) return str;
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getUserName = (user) => {
  if (!user) return '';
  const userInitialName = `${user?.firstName} ${user?.lastName}`;
  return user?.vendor?.companyName || userInitialName;
};
