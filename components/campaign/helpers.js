// Helper functions for ConfirmLandlordPage and related components

export const extractHighestValue = (value) => {
  if (!value) return 0;
  if (typeof value === 'string') {
    const match = value.match(/₦([\d,]+)/g);
    if (match && match.length > 0) {
      const nums = match.map((val) => parseInt(val.replace(/[₦,]/g, '')));
      return Math.max(...nums);
    }
  }
  return parseInt(value.replace(/[₦,]/g, '')) || 0;
};

export const parseSavingPercent = (value) => {
  if (!value) return 0.33; // default 33%
  if (value.includes('75%')) return 0.75;
  if (value.includes('50%')) return 0.5;
  if (value.includes('33%')) return 0.33;
  if (value.includes('25%')) return 0.25;
  if (value.includes('20%')) return 0.2;
  return 0.33; // fallback
};

export const displayValue = (rawValue, extractedNumber) => {
  if (!rawValue) return 'N/A';
  if (rawValue.includes('₦') && rawValue.includes('-')) {
    // Range → show "~ ₦number"
    return `~ ₦${extractedNumber.toLocaleString()}`;
  } else if (rawValue === 'Other (enter exact amount)') {
    return `₦${extractedNumber.toLocaleString()}`;
  } else {
    return `₦${extractedNumber.toLocaleString()}`;
  }
};
