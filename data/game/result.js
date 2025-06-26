/******************************************************************
 * /data/game/result.js   – bullet copy for interludes
 ******************************************************************/
const ResultCopy = {
  /* -------------------------------------------------------------
     1. HOMEOWNERSHIP STATUS
     ------------------------------------------------------------- */
  homeownership_status: {
    'I rent my home': [
      "Your rent receipt is just a receipt—not a trophy. Let's turn those payments into <home_buying_timeline> keys instead.",
      'Every month your landlord wakes up richer—thanks to you. Time to flip the script.',
      "Rent is like Lagos traffic—slow, painful, and somehow always increasing. Own the road, don't just drive on it.",
    ],

    'I own my home': [
      "One house is cool, but two? Now you're the landlord collecting cheques.",
      "You wouldn't stop at one plate of jollof; why stop at one property? Double the portions, double the income.",
      'Turn your home into an ATM—Airbnb or rental income, choose your hustle.',
    ],

    'I live with family and friends': [
      'Unlimited free jollof, premium *who-ate-my-meat* investigations… and the inevitable “So, when are you moving?”',
      "Your current address? **37 Parents' Patience Lane, Expiring Soon.** Next stop: *My Own House Street.*",
      'Free Wi-Fi is nice, but independence is nicer. Time to plot your exit.',
    ],
  },

  /* -------------------------------------------------------------
     2. IDEAL LOCATION
     ------------------------------------------------------------- */
  ideal_location: {
    Island: [
      'From Ikoyi to Lekki Phase 1—premium real estate. Great choice!',
      'High demand, strong returns. Lagos Island never sleeps, and neither will your ROI.',
    ],
    Mainland: [
      'Culture, access, and comfort—Mainland living is solid value.',
      'Convenience meets affordability. Smart move!',
    ],
    Outskirt: [
      'Lower entry cost today, bigger rewards tomorrow. You’re thinking ahead!',
      "Long-term growth potential? The outskirts are where it's at.",
    ],
  },

  /* -------------------------------------------------------------
     3. HOUSE TYPE  (generic pool; placeholders will be filled)
     ------------------------------------------------------------- */
  house_type: [
    "You're eyeing a <number_of_bedrooms> <house_type> in <ideal_location>—solid pick! Comfort plus resale value.",
    "A <number_of_bedrooms> <house_type> in <ideal_location>? Premium move. Let's make it happen.",
    'Your dream setup—<number_of_bedrooms> <house_type>, <ideal_location>. Hot cake alert!',
  ],

  /* -------------------------------------------------------------
     4. HOME BUYING TIMELINE
     ------------------------------------------------------------- */
  home_buying_timeline: {
    'Within the next 6 months': [
      'Fast lane! Lock in developer discounts and sprint toward your keys.',
    ],
    '6 months - 12 months': [
      'Steady progress. Your dream home is closer than you think.',
    ],
    '1 - 2 years': [
      'Perfect runway. A focused plan + BALL rewards can cut this timeline even shorter.',
    ],
    '3 - 5 years': [
      'Plenty of time to explore flexible plans and catch market bargains.',
    ],
    '6 - 10 years': [
      'Inflation never sleeps—start planting seeds now, future keys are growing.',
    ],
    'Just exploring': [
      "Exploring is a great first step. We'll show you what's possible—no pressure.",
    ],
  },

  /* -------------------------------------------------------------
     5. HOME PAYING TIMELINE
     ------------------------------------------------------------- */
  home_paying_timeline: {
    'Yes ready now': [
      "Early payments = early ownership. Momentum is money—let's move.",
    ],
    'Ready in 3 - 6 months': [
      'Perfect window to prep for a flexible payment plan.',
    ],
    'Need 6 - 12 months': [
      'Enough time to build a strategy that fits your cash-flow.',
    ],
    'Not sure - need guidance': [
      "No stress—let's weigh your options and craft a timeline you can follow.",
    ],
  },

  /* -------------------------------------------------------------
     6. SAVING PERCENT
     ------------------------------------------------------------- */
  saving_percent: {
    'Super Aggressive (75%)': [
      'Beast mode! Your dream just got an express lane.',
    ],
    'Aggressive (50%)': ['Bold and focused. Keys are closer than you think.'],
    'Recommended (33%)': [
      'Smart and sustainable—the sweet spot for most homeowners.',
    ],
    'Cautious (25%)': ['Steady progress. Consistency will get you home.'],
    'Minimum (20%)': ["It’s a start! We'll build from here."],
  },

  /* -------------------------------------------------------------
     7. FINANCIAL ADVISORY
     ------------------------------------------------------------- */
  financial_advisory: {
    'Not yet but I’m considering it': [
      'Smart move. A good advisor helps you dodge costly mistakes.',
    ],
    'No I manage my finances myself': [
      "DIY is fine—just schedule strategy check-ins so you don't plateau.",
    ],
    'Occasionally for investment planning': [
      'A quick expert check before a big move goes a long way.',
    ],
    'Yes I work with a financial strategist': [
      'Consistency compounds. Keep those strategy sessions rolling!',
    ],
  },

  /* -------------------------------------------------------------
     8. RETIREMENT PLANNING
     ------------------------------------------------------------- */
  retirement_planning: {
    'No I haven’t started yet': [
      'Even small savings grow big with time—start today.',
    ],
    'Yes (Less than ₦10,000,000)': [
      'Foundations are set. Time to level up and grow your wealth.',
    ],
    'Yes (₦10,000,001 - ₦25,000,000)': [
      'Solid stash—real estate could be your next big win.',
    ],
    'Yes (₦25,000,001 - ₦50,000,000)': [
      "Impressive! Let's put some of that capital to work in smart properties.",
    ],
  },
};

export default ResultCopy;
