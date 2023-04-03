export const FREQUENCY_IN_WORDS = {
  0.5: 'Bi-Weekly',
  1: 'Monthly',
  4: 'Quarterly',
};

export const PACKAGES = {
  OUTRIGHT_PAYMENT: {
    title: `Outright Payment`,
    advice: `With no extra credit option, you're one step away from owning your home`,
  },
  SPREAD_PAYMENT: {
    title: `Spread Payment`,
    advice: `Pay as low as 20%, and spreading the remaining balance within`,
  },
  OUTRIGHT_PMI_MORTGAGE: {
    title: `PMI Mortgage`,
    advice: `You're eligible for a PMI mortgage`,
  },
  ASSISTED_PMI_MORTGAGE: {
    title: `PMI Mortgage`,
    advice: `You start BALLing and contribute to meet the required equity to secure a PMI mortgage and own your home`,
  },
  OUTRIGHT_NHF_MORTGAGE: {
    title: `NHF Mortgage`,
    advice: `You're eligible for a NHF mortgage`,
  },
  ASSISTED_NHF_MORTGAGE: {
    title: `NHF Mortgage`,
    advice: `Build your equity to acquire NHF mortgage`,
  },
  RENT_TO_OWN: {
    title: `Rent-to-own`,
    advice: `Just like rent, you can own your home. Rent to own.`,
  },
  ASSISTED_RENT_TO_OWN: {
    title: `Rent-to-own`,
    advice: `Build equity to start rent to own`,
  },
  HYBRID: {
    title: `Hybrid`,
    advice: `A whole new solution that combines solutions to make owning your home a whole lot easier`,
  },
  INELIGIBLE: {
    title: `Ineligible`,
    advice: `You're almost there, keep contributing`,
  },
};

export const recommendBallersPlan = ({
  initial,
  monthly,
  frequency,
  comfortLevel,
  result,
}) => {
  let propertyCost = result.averagePrice;
  const periodic = (monthly * comfortLevel) / 100;
  const recommendedPropertyPrice = Math.min(
    periodic * 12 + initial,
    result.maximumPrice
  );

  if (frequency === 1) {
    propertyCost = result.maximumPrice;
  }

  const balance = propertyCost - initial;

  let output = [];

  // Recommendations breakdown can be found here - https://docs.google.com/document/d/1gsomOY9qclUz9RzadN3ztJH4Y0ryGT-fukNBFLhJAIU/edit?pli=1#heading=h.yy9lcow7gkem
  const outrightPaymentPesonal =
    initial >= propertyCost * 0.5 && balance / periodic < 6;

  const completeSpreadPayment =
    initial >= propertyCost * 0.2 &&
    balance / periodic > 6 &&
    balance / periodic <= 24;

  const outrightMortgagePMI =
    initial >= propertyCost * 0.25 &&
    balance / periodic > 24 &&
    propertyCost + 2500000 - initial <= 45000000;

  const outrightMortgageNHF =
    initial >= propertyCost * 0.1 &&
    propertyCost + 2500000 - initial <= 15000000;

  const assistedMortgagePMI =
    periodic * frequency * 24 >= propertyCost * 0.25 &&
    propertyCost + 2500000 - initial > 15000000 &&
    propertyCost + 2500000 - initial <= 45000000;

  const assistedMortgageNHF =
    periodic * frequency * 24 >= propertyCost * 0.1 &&
    propertyCost + 2500000 - initial <= 15000000;

  const rentToOwn =
    initial >= propertyCost * 0.05 &&
    periodic >= propertyCost * 0.01 &&
    balance / periodic <= 120;

  const assistedRentToOwn =
    initial <= propertyCost * 0.05 &&
    periodic >= propertyCost * 0.01 &&
    balance / periodic <= 120;

  const hybrid =
    initial <= propertyCost * 0.05 &&
    periodic >= propertyCost * 0.01 &&
    balance / periodic <= 24;

  if (outrightPaymentPesonal) {
    output.push(PACKAGES.OUTRIGHT_PAYMENT);
  }
  if (completeSpreadPayment) {
    output.push(PACKAGES.SPREAD_PAYMENT);
  }
  if (outrightMortgagePMI) {
    output.push(PACKAGES.OUTRIGHT_PMI_MORTGAGE);
  }
  if (!outrightMortgagePMI && assistedMortgagePMI) {
    output.push(PACKAGES.ASSISTED_PMI_MORTGAGE);
  }
  if (outrightMortgageNHF) {
    output.push(PACKAGES.OUTRIGHT_NHF_MORTGAGE);
  }
  if (!outrightMortgageNHF && assistedMortgageNHF) {
    output.push(PACKAGES.ASSISTED_NHF_MORTGAGE);
  }
  if (rentToOwn) {
    output.push(PACKAGES.RENT_TO_OWN);
  }
  if (!rentToOwn && assistedRentToOwn) {
    output.push(PACKAGES.ASSISTED_RENT_TO_OWN);
  }
  if (hybrid) {
    output.push(PACKAGES.HYBRID);
  }
  if (
    !outrightPaymentPesonal &&
    !completeSpreadPayment &&
    !outrightMortgagePMI &&
    !assistedMortgagePMI &&
    !outrightMortgageNHF &&
    !assistedMortgageNHF &&
    !rentToOwn &&
    !assistedRentToOwn &&
    !hybrid
  ) {
    output.push(PACKAGES.INELIGIBLE);
  }

  return {
    recommendations: output,
    initial,
    monthlyPayment: periodic,
    frequency,
    propertyCost: Math.max(propertyCost, recommendedPropertyPrice),
    ...result,
  };
};

//   const testObject = {
//   propertyCost: 20000000,
//   frequency: 1,
//   initial: 363587,
//   output: [
//     { title: 'Ineligible', advice: "You're almost there, keep contributing" },
//   ],
//   periodic: 8507,
// };

// Guide - https://nigeriapropertycentre.com/market-trends/average-prices/for-sale/houses/lagos
