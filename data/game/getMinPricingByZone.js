import { locationsByZone } from './location';
import { pricingData } from './pricingData';

/* ------------------------------------------------------------------
 * locationAlias.js
 * ------------------------------------------------------------------
 *  UI label  →  canonical key used in pricingData
 *  ( → add new entries whenever you introduce a new spelling )
 * ----------------------------------------------------------------- */
export const locationAlias = {
  // Nigeria loves commas & dashes – normalise them away ↓
  'Ikeja (State Capital)': 'Ikeja GRA',
  Lekki: 'Lekki Phase 1',
  'Lekki Phase 1': 'Lekki Phase 1',
  'Lekki Phase I': 'Lekki Phase 1',
  'Lekki Phase I': 'Lekki Phase 1',

  'Eti-Osa': 'Lekki Phase 1',
  Epe: 'Epe', // future-proof, data = Ø right now
  'Lagos Island': 'Victoria Island', // most users mean VI
  Apapa: 'Apapa', // not (yet) in dataset
  Badagry: 'Badagry',
  'Ibeju-Lekki': 'Lekki Phase 1',

  Ikeja: 'Ikeja GRA',
  Agege: 'Ikeja GRA', // closest proxy
  Oshodi: 'Ikeja GRA',
  Mushin: 'Ikeja GRA',
  Ifako: 'Ikeja GRA',
  Somolu: 'Ikeja GRA',
  Ojo: 'Ikeja GRA',

  Berger: 'Ikeja GRA',
  'Iyana Ipaja': 'Ikeja GRA',
  'Sango Ota': 'Ikeja GRA',
  Igando: 'Ikorodu',
};

/* quick util – imported by the main builder */
export const safeLocKey = (uiLabel) =>
  locationAlias[uiLabel.trim()] ?? uiLabel.trim();

const getMinPricingByZone = () => {
  const output = {};

  for (const [zone, locList] of Object.entries(locationsByZone || {})) {
    if (!Array.isArray(locList)) continue;

    locList.forEach((uiLoc) => {
      const locKey = safeLocKey(uiLoc); // normalise for dataset lookup

      for (const [houseType, locations] of Object.entries(pricingData || {})) {
        const locBlock = locations[locKey];
        if (!locBlock) continue; // skip if that house-type has no data here

        for (const [bedBand, numbers] of Object.entries(locBlock)) {
          const minVal = numbers?.min ?? 0;
          if (!minVal) continue; // ignore 0 values

          // ---------- build nested path ----------
          output[zone] ??= {};
          output[zone][houseType] ??= {};
          output[zone][houseType][bedBand] ??= {};

          // keep the *lowest* min found for that bedroom band & UI-location
          const prev = output[zone][houseType][bedBand][uiLoc];
          if (prev === undefined || minVal < prev) {
            output[zone][houseType][bedBand][uiLoc] = minVal;
          }
        }
      }
    });

    // tidy up empty zones (all data were zero)
    if (output[zone] && Object.keys(output[zone]).length === 0) {
      delete output[zone];
    }
  }

  return output;
};

export default getMinPricingByZone;
