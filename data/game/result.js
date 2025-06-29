/******************************************************************
 * /data/game/result.js   – bullet copy for interludes
 ******************************************************************/
const ResultCopy = {
  /* -------------------------------------------------------------
     1. HOMEOWNERSHIP STATUS
     ------------------------------------------------------------- */
  homeownership_status: {
    'I rent my home': [
      'CEO of ‘Making Other People Rich, Inc: Your rent receipt is just a receipt—not a trophy. Landlords don’t frame your payments and hang them on the wall. Your name should be on a deed, not a lease.',
      "Maybe it's time to stop funding your landlord’s flex and start building your own.",
      'You cook, they feast. Shift the narrative. Build your own kitchen. Buy your home today.',
      'Every month, your landlord wakes up and chooses wealth—thanks to you! Time to break free and start securing your own bag.',
      'Paying rent is like feeding a goat your paycheck—it’s never full, and it won’t even thank you. Stop feeding the goat and buy the farm!',
      'Rent is like Lagos traffic—painful, unpredictable, and somehow still increasing. Time to stop cruising and start owning!',
      'You’re building wealth… just not your own. Every naira you send strengthens their portfolio. Time to start yours.',
      'You’ve been loyal to your rent like it’s a relationship. But what has it given you besides annual heartbreak and price hikes? It’s time for a commitment that appreciates.',
      'You’re not just paying rent—you’re funding someone’s next real estate empire.',
      'Shows up, takes your money, disappears without thanks. Let’s invest in something with actual returns.',
      'Your real estate can be your retirement plan, daily income, and status symbol all in one.',
    ],

    'I own my home': [
      'One house is cool, but two? Now you’re a landlord, not just a homeowner—AKA the person who collects rent instead of crying about it. Upgrade your status!',
      'Why stop at one address when you can run a portfolio? One house says stability. Two or more? That’s generational chess.',
      'You wouldn’t stop at one plate of jollof rice, so why stop at one property? Double your portions, double your income—your future self will thank you!',
      "Homeowner? Big flex! Next move? Turning your property into Lagos' newest cash cow—Airbnb or rental income, the city is yours to conquer.",
      'Next step? Turning your home into your very own ATM—rental income or Airbnb, choose your hustle!',
      'Your real estate can be your retirement plan, daily income, and status symbol all in one.',
      'You’ve got one house. Cool story. Let’s talk empire.',
      'Landlord status isn’t just about keys—it’s about cash flow. Multiply your assets. Multiply your wins.',
      'Real estate investment is the next step for you to go. Rental income or Airbnb will fetch you a lot of money.',
      'They’re still posting housewarming selfies. You’re posting rental alerts. Be the landlord that inspires a thousand vision boards.',
    ],

    'I live with family and friends': [
      'Hmmmm, we don’t know o. We think you need a lot of help.',
      'Your current address? ‘37 Parents’ Patience Lane, Expiring Soon.’ Next stop? Either ‘My Own House’ or *‘50-Year-Old Roommate Avenue.’* Choose wisely.',
      'Free food, free WiFi, free unsolicited life lessons—but one day, someone will say, “So, when are you moving?”',
      'Unlimited free jollof, premium “who ate my meat?” investigations, and the occasional “So… any plans to move?”',
      'Still living at home? That’s cool… until it’s not. Today it’s free jollof. Tomorrow it’s, “This house is not a hotel.”',
      'Living with family isn’t a failure—it’s a phase. But every phase has an expiry date. Don’t get caught slipping.',
      'One day you’ll wake up to find someone moved into your room. Spoiler alert: It’s not your house.',
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
      "If you're ready to pay in full, BALL connects you directly to vetted developers with ready-to-go deals—fast, secure, and transparent.",
      'Leverage your upfront payment to access top-tier listings on BALL and close with confidence, no middlemen involved.',
      'With BALL, full payment means full control—discover properties, meet vetted developers, and complete your transaction seamlessly.',
    ],
    'Ready in 3 - 6 months': [
      'Planning to complete payment in a few months? BALL helps you connect with vetted developers offering flexible short-term options.',
      'Secure a deal now and pay with confidence—BALL supports your timeline while keeping the process smooth.',
      'This is your prep window—use BALL to stay updated on listings that match your budget and your timeline.',
    ],
    'Need 6 - 12 months': [
      'Looking at a longer plan? BALL guides you to vetted developers with extended payment structures that fit your goals.',
      'You have the time—BALL gives you the tools to track offers, map your payment journey, and move when you’re ready.',
      'BALL empowers future buyers with patience and precision—no pressure, just good planning with the right partners.',
    ],
    'Not sure - need guidance': [
      'Feeling unsure? BALL helps you explore options and connect with vetted developers offering flexible timelines and expert support.',
      'Start with discovery, not decisions—BALL simplifies the process and gives you room to gain clarity.',
      'With BALL, you don’t have to figure it out alone. We offer guidance, education, and vetted connections until you’re ready.',
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
