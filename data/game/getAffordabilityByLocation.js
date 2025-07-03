/******************************************************************
 * utils/getAffordabilityByLocation.js
 * ----------------------------------------------------------------
 *  – NEW: if a house-type ( “flats” / “terraces” … ) is missing
 *         for the chosen zone we now fall back to the first one
 *         that exists in that zone.
 ******************************************************************/

import { TIERS } from './tiers';

/* ───── mini-helpers (unchanged) ─────────────────────────────── */
function pickBiggestNumber(txt = '') {
  const nums = (txt.match(/\d[\d,]*/g) || []).map((n) =>
    Number(n.replace(/[^\d]/g, ''))
  );
  return nums.length ? Math.max(...nums) : 0;
}
const savingRatio = (label) => (Number(label.match(/\d+/)) || 25) / 100; // default → 0.25

const bedroomKey = (label) =>
  /studio/i.test(label)
    ? '1-Bedroom'
    : label.replace(/\s?Bedroom/i, '-Bedroom');

const typeKey = (label) =>
  ({
    Flat: 'flats',
    Terrace: 'terraces',
    'Semi Detached': 'semiTerraces',
    Detached: 'detached',
    Bungalow: 'detached',
  }[label] || 'flats');

const zoneFor = (loc, zones) =>
  Object.entries(zones).find(([, arr]) => arr.includes(loc))?.[0];

/* ───── main utility ─────────────────────────────────────────── */
export function getAffordabilityByLocation(pricingByZone, answers, zonesMap) {
  /* ── money figures from the quiz ─────────────────────────── */
  const income =
    pickBiggestNumber(answers.income_bracket) ||
    pickBiggestNumber(answers.income_bracket_custom);
  const savingPlan =
    pickBiggestNumber(answers.saving_plan) ||
    pickBiggestNumber(answers.saving_plan_custom);
  const debt = 0; // no longer considered
  const pension = pickBiggestNumber(answers.retirement_planning);
  const ratio = savingRatio(answers.saving_percent);

  /* ── locate the dataset slice the user cares about ───────── */
  const zone = ['Island', 'Mainland', 'Outskirt'].includes(
    answers.ideal_location
  )
    ? answers.ideal_location
    : zoneFor(answers.ideal_location, zonesMap);

  if (!zone || !pricingByZone[zone]) return {};

  /* pick a house-type – fall back if missing */
  const wantType = typeKey(answers.house_type);
  const type = pricingByZone[zone][wantType]
    ? wantType
    : Object.keys(pricingByZone[zone])[0];

  /* pick a bedroom band – fall back if missing */
  const wantBed = bedroomKey(answers.number_of_bedrooms);
  const bed = pricingByZone[zone][type][wantBed]
    ? wantBed
    : Object.keys(pricingByZone[zone][type])[0];

  /* ── financial helpers ───────────────────────────────────── */
  const monthly = income * ratio;
  const upfront = savingPlan + pension * 0.25;
  const yearsFor = (price) => {
    const gap = Math.max(price + debt - upfront, 0);
    if (!gap) return 0;
    if (!monthly) return 'N/A';
    return Math.ceil(gap / monthly / 12);
  };

  /* ── build answer object ─────────────────────────────────── */
  const out = {};

  Object.entries(pricingByZone[zone][type][bed]).forEach(([loc, price]) => {
    if (price) out[loc] = { price, years: yearsFor(price) };
  });

  return out;
}

// Reusable summary generator
export function getTierSummary(
  summaryTemplate,
  answers,
  yearsToBuy = 0,
  firstName = 'Baller'
) {
  return summaryTemplate
    .replaceAll('<first_name>', firstName)
    .replaceAll('<bedroom>', answers.number_of_bedrooms.toLowerCase())
    .replaceAll('<house_type>', answers.house_type.toLowerCase())
    .replaceAll('<location_zone>', `Lagos ${answers.ideal_location}`)
    .replaceAll('<years_num>', Math.max(yearsToBuy, 1))
    .replaceAll(
      '<timeline_phrase>',
      yearsToBuy <= 1
        ? 'in under a year'
        : yearsToBuy <= 2
        ? 'in under two years'
        : `in about ${yearsToBuy} years`
    )
    .replace(/\*(.*?)\*/g, '<b>$1</b>');
}

export const getTierInfo = (yearsToBuy, answers, firstName) => {
  const statusKey = {
    'I rent my home': 'rent',
    'I own my home': 'own',
    'I live with family and friends': 'family',
  }[answers.homeownership_status];

  const tier =
    TIERS.find((t) => yearsToBuy <= t.maxYears) || TIERS[TIERS.length - 1];
  const maxLength = Math.min(
    tier.descriptions.length,
    tier.summaries[statusKey]?.length || 0
  );
  const index = Math.floor(Math.random() * maxLength);

  const description = tier.descriptions[index].replace(/\n/g, '<br>');
  const summaryTemplate = tier.summaries[statusKey][index];
  const summary = getTierSummary(
    summaryTemplate,
    answers,
    yearsToBuy,
    firstName
  );

  return {
    emoji: tier.emoji,
    label: tier.label,
    description,
    summary,
  };
};
