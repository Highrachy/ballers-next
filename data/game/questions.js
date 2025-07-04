// questions.js
import { locationsByZone } from './location'; // adjust path as needed

/* ---------- Helper: Build location options ---------- */
const locationOptions = Object.entries(locationsByZone).map(
  ([zone, areas]) => ({
    label: zone,
    subtext: areas.join(', '),
    emoji: `2-location-${zone.toLowerCase()}.svg`,
  })
);

const questions = [
  /* -------------------------------------------------------------------- */
  /*                               REAL ESTATE                            */
  /* -------------------------------------------------------------------- */
  {
    section: 'REAL ESTATE',
    questions: [
      {
        id: 'homeownership_status',
        label: 'Homeownership Status',
        prompt: 'What is your current housing situation?',
        description:
          'Are you currently paying rent, living in your own house, or staying with family/friends?',
        type: 'options',
        options: [
          {
            label: 'I rent my home',
            subtext: 'I pay monthly or yearly rent',
            emoji: '1-rent.svg',
          },
          {
            label: 'I own my home',
            subtext: 'I own it fully or paying mortgage',
            emoji: '1-own.svg',
          },
          {
            label: 'I live with family and friends',
            subtext: 'Staying without paying rent',
            emoji: '1-stay.svg',
          },
        ],
      },
      {
        id: 'ideal_location',
        label: 'Ideal Location',
        prompt: 'Where do you want to live in Lagos?',
        description:
          'Choose your preferred area of Lagos where you want to buy your home.',
        type: 'options',
        options: locationOptions,
      },
      {
        id: 'house_type',
        label: 'House Type',
        prompt: 'What type of house would you like to own?',
        description: 'Pick the style of home that matches your dream.',
        type: 'options',
        options: [
          {
            label: 'Bungalow',
            subtext: 'Single-floor family house',
            emoji: '3-bungalow.svg',
          },
          {
            label: 'Flat',
            subtext: 'Apartment in a block (one floor)',
            emoji: '3-flat.svg',
          },
          {
            label: 'Terrace',
            subtext: 'Row house with shared side walls',
            emoji: '3-terrace.svg',
          },
          {
            label: 'Semi Detached',
            subtext: 'Twin house, one shared wall',
            emoji: '3-semi-detached.svg',
          },
          {
            label: 'Detached',
            subtext: 'Fully independent house with space all around',
            emoji: '3-detached.svg',
          },
        ],
      },
      {
        id: 'number_of_bedrooms',
        label: 'Number of Bedrooms',
        prompt: 'How many bedrooms would you want in your dream home?',
        description: 'Select the bedroom count that fits your household.',
        type: 'options',
        options: [
          {
            label: 'Studio',
            subtext: 'One large room with kitchen & bath',
            emoji: '4-1.svg',
          },
          {
            label: '2 Bedroom',
            subtext: 'Two-bedroom flat or house',
            emoji: '4-2.svg',
          },
          {
            label: '3 Bedroom',
            subtext: 'Three-bedroom flat or duplex',
            emoji: '4-3.svg',
          },
          {
            label: '4 Bedroom',
            subtext: 'Four-bedroom duplex or luxury flat',
            emoji: '4-4.svg',
          },
          {
            label: '5 Bedroom',
            subtext: 'Five-bedroom luxury or family house',
            emoji: '4-5.svg',
          },
        ],
      },
      {
        id: 'home_buying_timeline',
        label: 'Home Buying Timeline',
        prompt: 'When do you want to buy your next house?',
        description: 'Tell us how soon you plan to become a homeowner.',
        type: 'options',
        options: [
          {
            label: 'Within the next 6 months',
            subtext: 'Very ready, funds almost complete',
            emoji: '5-calendar.svg',
          },
          {
            label: '6 months - 12 months',
            subtext: 'Getting ready, still saving',
            emoji: '5-calendar.svg',
          },
          {
            label: '1 - 2 years',
            subtext: 'Planning & building funds',
            emoji: '5-calendar.svg',
          },
          {
            label: '3 - 5 years',
            subtext: 'Longer-term plan',
            emoji: '5-calendar.svg',
          },
          {
            label: '6 – 10 years',
            subtext: 'Future dream',
            emoji: '5-calendar.svg',
          },
          {
            label: 'Just exploring',
            subtext: 'No fixed timeline yet',
            emoji: '5-calendar.svg',
          },
        ],
      },
      {
        id: 'home_paying_timeline',
        label: 'Home Paying Timeline',
        prompt: 'How long do you want to spread your payment?',
        description:
          'Select when you’d like to start and how quickly to finish payment.',
        type: 'options',
        options: [
          {
            label: 'Yes ready now',
            subtext: 'I can start making payment now',
            emoji: '6-now.svg',
          },
          {
            label: 'Ready in 3 - 6 months',
            subtext: 'Need 3-6 months to prepare',
            emoji: '6-3-to-6-months.svg',
          },
          {
            label: 'Need 6 - 12 months',
            subtext: 'Still saving / arranging funds',
            emoji: '6-6-to-12-months.svg',
          },
          {
            label: 'Not sure - need guidance',
            subtext: 'Would like expert advice',
            emoji: '6-help.svg',
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------- */
  /*                         FINANCIAL MANAGEMENT                         */
  /* -------------------------------------------------------------------- */
  {
    section: 'FINANCIAL MANAGEMENT',
    questions: [
      {
        id: 'saving_percent',
        label: 'Savings % of Monthly Income',
        prompt:
          'How much of your monthly income are you willing to save towards buying your home?',
        description:
          'The higher your savings percentage, the faster you can reach your goal.',
        type: 'options',
        options: [
          {
            label: 'Super Aggressive (75%)',
            subtext: 'Save 75% of income monthly',
            emoji: '8-75-savings.svg',
          },
          {
            label: 'Aggressive (50%)',
            subtext: 'Save 50% of income monthly',
            emoji: '8-50-savings.svg',
          },
          {
            label: 'Recommended (33%)',
            subtext: 'Recommended saving target',
            emoji: '8-33-savings.svg',
          },
          {
            label: 'Cautious (25%)',
            subtext: 'Save 25% of income monthly',
            emoji: '8-25-savings.svg',
          },
          {
            label: 'Minimum (20%)',
            subtext: 'Minimum saving level',
            emoji: '8-20-savings.svg',
          },
        ],
      },
      {
        id: 'financial_advisory',
        label: 'Financial Advisory',
        prompt: 'Do you have a financial advisor?',
        description:
          'A financial advisor is an expert you consult for money advice.',
        type: 'options',
        options: [
          {
            label: "Not yet but I'm considering it",
            subtext: 'Planning to get one',
            emoji: 'thinking.svg',
          },
          {
            label: 'No, I manage my finances myself',
            subtext: 'I handle it myself',
            emoji: 'smile.svg',
          },
          {
            label: 'Occasionally for investment planning',
            subtext: 'I consult sometimes',
            emoji: 'starstruck.svg',
          },
          {
            label: 'Yes, I work with a financial strategist',
            subtext: 'I use an advisor regularly',
            emoji: 'with-glasses.svg',
          },
        ],
      },
      {
        id: 'retirement_planning',
        label: 'Retirement Planning',
        prompt: 'Do you have retirement savings?',
        description:
          'How much have you saved so far in pension/retirement savings?',
        type: 'options',
        options: [
          {
            label: "No I haven't started yet",
            subtext: 'No savings yet',
          },
          {
            label: 'Yes (Less than ₦10,000,000)',
            subtext: 'Below ₦10 million',
          },
          { label: 'Yes (₦10,000,001 - ₦25,000,000)', subtext: '₦10M to ₦25M' },
          { label: 'Yes (₦25,000,001 - ₦50,000,000)', subtext: '₦25M to ₦50M' },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------- */
  /*                          FINANCIAL STATUS                            */
  /* -------------------------------------------------------------------- */
  {
    section: 'FINANCIAL STATUS',
    questions: [
      {
        id: 'income_bracket',
        label: 'Income Bracket',
        prompt: 'What is your monthly income?',
        description:
          'Include all money you typically earn each month (salary, side hustles, business income, freelance jobs, etc).',
        type: 'options',
        options: [
          { label: 'Less than ₦500,000', subtext: 'Below ₦500k per month' },
          {
            label: '₦500,000 - ₦1,000,000',
            subtext: '₦500k to ₦1 million monthly',
          },
          { label: '₦1,000,001 - ₦3,000,000', subtext: '₦1M to ₦3M per month' },
          { label: '₦3,000,001 - ₦5,000,000', subtext: '₦3M to ₦5M monthly' },
          {
            label: '₦5,000,001 and above',
            subtext: 'Above ₦5 million monthly',
          },
          { label: 'Other', subtext: 'Enter exact amount' },
        ],
      },
      {
        id: 'saving_plan',
        label: 'Saving Plan',
        prompt: 'How much do you have saved towards buying a new home?',
        description:
          'Include all your savings that can go towards your home (cash, investments, etc).',
        type: 'options',
        options: [
          { label: 'Less than ₦5,000,000', subtext: 'Below ₦5 million saved' },
          { label: '₦5,000,001 - ₦10,000,000', subtext: '₦5M to ₦10M saved' },
          { label: '₦10,000,001 - ₦25,000,000', subtext: '₦10M to ₦25M saved' },
          { label: '₦25,000,001 - ₦50,000,000', subtext: '₦25M to ₦50M saved' },
          {
            label: 'Above ₦50,000,000',
            subtext: 'More than ₦50 million saved',
          },
          { label: 'Other', subtext: 'Enter exact amount' },
        ],
      },
    ],
  },
];

export default questions;
