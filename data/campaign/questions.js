// questions.js
import { locationsByZone } from './location'; // adjust path as needed

// build <label, subtext> objects from locationsByZone
const locationOptions = Object.entries(locationsByZone).map(
  ([zone, areas]) => ({
    label: zone,
    subtext: areas.join(', '),
  })
);

const questions = [
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
          { label: 'I rent my home', subtext: 'I pay monthly or yearly rent' },
          {
            label: 'I own my home',
            subtext: 'I own it fully or paying mortgage',
          },
          {
            label: 'I live with family and friends',
            subtext: 'Staying without paying rent',
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
        description: 'Select the type of house that matches your dream home.',
        type: 'options',
        options: [
          { label: 'Bungalow', subtext: 'Single-floor family house' },
          { label: 'Flat', subtext: 'Apartment in a block (one floor)' },
          { label: 'Terrace', subtext: 'Row house with shared side walls' },
          { label: 'Semi Detached', subtext: 'Twin house, one shared wall' },
          {
            label: 'Detached',
            subtext: 'Fully independent house with space all around',
          },
        ],
      },
      {
        id: 'number_of_bedrooms',
        label: 'Number of Bedrooms',
        prompt: 'How many bedrooms would you like?',
        description:
          'Select the number of bedrooms that would suit your needs.',
        type: 'options',
        options: [
          { label: 'Studio', subtext: 'One large room with kitchen & bath' },
          { label: '2 Bedroom', subtext: 'Two-bedroom flat or house' },
          { label: '3 Bedroom', subtext: 'Three-bedroom flat or duplex' },
          { label: '4 Bedroom', subtext: 'Four-bedroom duplex or luxury flat' },
          {
            label: '5 Bedroom',
            subtext: 'Five-bedroom luxury or family house',
          },
        ],
      },
      {
        id: 'home_buying_timeline',
        label: 'Home Buying Timeline',
        prompt: 'When do you plan to buy your next house?',
        description: 'How soon are you planning to become a homeowner?',
        type: 'options',
        options: [
          {
            label: 'Within the next 6 months',
            subtext: 'Very ready, funds almost complete',
          },
          {
            label: '6 months - 12 months',
            subtext: 'Getting ready, still saving',
          },
          { label: '1 - 2 years', subtext: 'Planning & building funds' },
          { label: '3 - 5 years', subtext: 'Longer-term plan' },
          { label: '6 - 10 years', subtext: 'Future goal, not urgent' },
          {
            label: 'Just exploring',
            subtext: 'Just checking options, no timeline yet',
          },
        ],
      },
      {
        id: 'home_paying_timeline',
        label: 'Home Paying Timeline',
        prompt: 'When do you want to start paying for the house?',
        description:
          'How soon would you like to start making payments towards the home?',
        type: 'options',
        options: [
          { label: 'Yes ready now', subtext: 'I can start making payment now' },
          {
            label: 'Ready in 3 - 6 months',
            subtext: 'Need 3-6 months to prepare',
          },
          {
            label: 'Need 6 - 12 months',
            subtext: 'Still saving / arranging funds',
          },
          {
            label: 'Not sure - need guidance',
            subtext: 'Would like expert advice',
          },
        ],
      },
    ],
  },
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
          { label: 'Other (enter exact amount)', subtext: '' },
        ],
      },
      {
        id: 'saving_plan',
        label: 'Saving Plan',
        prompt: 'How much have you saved towards buying a house?',
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
          { label: 'Other (enter exact amount)', subtext: '' },
        ],
      },
    ],
  },
  {
    section: 'FINANCIAL MANAGEMENT',
    questions: [
      {
        id: 'debt_profile',
        label: 'Debt Profile',
        prompt: 'What is your total debt?',
        description:
          'Include all outstanding debts you are currently owing (loans, credit, personal debts).',
        type: 'options',
        options: [
          { label: 'No debt', subtext: 'No debt at all' },
          { label: 'Less than ₦1,000,000', subtext: 'Below ₦1 million' },
          { label: '₦1,000,001 - ₦5,000,000', subtext: '₦1M to ₦5M debt' },
          { label: '₦5,000,001 - ₦10,000,000', subtext: '₦5M to ₦10M debt' },
          { label: 'Above ₦10,000,000', subtext: 'Above ₦10 million debt' },
          { label: 'Other (enter exact amount)', subtext: '' },
        ],
      },
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
          },
          { label: 'Aggressive (50%)', subtext: 'Save 50% of income monthly' },
          { label: 'Recommended (33%)', subtext: 'Recommended saving target' },
          { label: 'Cautious (25%)', subtext: 'Save 25% of income monthly' },
          { label: 'Minimum (20%)', subtext: 'Minimum saving level' },
        ],
      },
      {
        id: 'financial_advisory',
        label: 'Financial Advisory',
        prompt: 'Do you work with a financial advisor?',
        description:
          'Do you currently get professional help to manage your finances?',
        type: 'options',
        options: [
          {
            label: 'Not yet but I’m considering it',
            subtext: 'Planning to get one',
          },
          {
            label: 'No I manage my finances myself',
            subtext: 'I handle it myself',
          },
          {
            label: 'Occasionally for investment planning',
            subtext: 'I consult sometimes',
          },
          {
            label: 'Yes I work with a financial strategist',
            subtext: 'I use an advisor regularly',
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
          { label: 'No I haven’t started yet', subtext: 'No savings yet' },
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
];

export default questions;
