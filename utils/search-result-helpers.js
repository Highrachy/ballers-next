export const FREQUENCY_IN_WORDS = {
  0.5: 'Bi-Weekly',
  1: 'Monthly',
  4: 'Quarterly',
};

export const PACKAGES = {
  OUTRIGHT_PAYMENT: {
    title: `Outright Payment`,
    advice: `With no extra credit option, you're just one step away from owning your dream home outright. Take the leap towards homeownership today! Enjoy the freedom and security of owning your home without the burden of monthly installments.`,
  },
  SPREAD_PAYMENT: {
    title: `Spread Payment`,
    advice: `Pay as low as 20% upfront and spread the remaining balance within manageable installments. It's a flexible way to ease into homeownership without the financial strain. Enjoy the benefits of owning your home while managing your finances more comfortably.`,
  },
  OUTRIGHT_PMI_MORTGAGE: {
    title: `PMI Mortgage`,
    advice: `Congratulations! You're eligible for a PMI mortgage, making homeownership more accessible. Take advantage of this opportunity to secure your home with ease. Enjoy the benefits of mortgage financing with favorable terms and conditions.`,
  },
  ASSISTED_PMI_MORTGAGE: {
    title: `PMI Mortgage`,
    advice: `Start your journey to homeownership with BALL and contribute to meet the required equity for a PMI mortgage. Together, we'll make your dream of owning a home a reality. Benefit from our expert guidance and support throughout the mortgage application process.`,
  },
  OUTRIGHT_NHF_MORTGAGE: {
    title: `NHF Mortgage`,
    advice: `Exciting news! You qualify for an NHF mortgage, designed to make homeownership more affordable. Seize this opportunity to secure your home with favorable terms. Enjoy the benefits of a subsidized mortgage and fulfill your dream of owning a home.`,
  },
  ASSISTED_NHF_MORTGAGE: {
    title: `NHF Mortgage`,
    advice: `Build your equity with BALL and unlock the benefits of an NHF mortgage. We'll guide you every step of the way towards achieving your homeownership goals. Take advantage of subsidized interest rates and flexible repayment options.`,
  },
  RENT_TO_OWN: {
    title: `Rent-to-Own`,
    advice: `Experience the best of both worlds with our rent-to-own option. Enjoy the perks of renting while working towards owning your home. Start your journey to homeownership today! Benefit from the flexibility and security of a rent-to-own agreement.`,
  },
  ASSISTED_RENT_TO_OWN: {
    title: `Rent-to-Own`,
    advice: `Take control of your future with our assisted rent-to-own program. Build equity over time and transition seamlessly from renting to owning. Your dream home awaits! Enjoy the convenience and stability of a rent-to-own arrangement with our expert assistance.`,
  },
  HYBRID: {
    title: `Hybrid`,
    advice: `Introducing our innovative hybrid solution, combining the best features to simplify homeownership. With BALL, owning your dream home is now more achievable than ever before. Benefit from a tailored approach that meets your unique needs and preferences.`,
  },
  INELIGIBLE: {
    title: `Ineligible`,
    advice: `You're almost there! Keep contributing and exploring your options with BALL. Together, we'll work towards making your dream of homeownership a reality. Take proactive steps to improve your eligibility and unlock exciting opportunities in the future.`,
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
