/******************************************************************
 * components/game/result/SummaryPage.jsx
 ******************************************************************/
import SummaryPageComponent from './SummaryPageComponent';
import { useEffect, useMemo } from 'react';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import getMinPricingByZone from '@/data/game/getMinPricingByZone';
import { locationsByZone } from '@/data/game/location';
import {
  getAffordabilityByLocation,
  getTierInfo,
} from '@/data/game/getAffordabilityByLocation';
import { STORAGE } from '../shared/helper';
import { gameEntrySync } from '../shared/gameSync';

export default function SummaryPage({ contact }) {
  // Use props if provided (shared view), otherwise use localStorage
  const [answers] = useLocalStorageState(STORAGE.ANSWERS, {});
  const [bulletCache, setBulletCache] = useLocalStorageState(
    STORAGE.BULLET_CACHE,
    {}
  );

  const name = contact?.name || ''; // fallback name
  const minByZone = getMinPricingByZone();
  const affordability = getAffordabilityByLocation(
    minByZone,
    answers,
    locationsByZone
  );
  const minYears = Math.min(
    ...Object.entries(affordability).map(([_, data]) => data.years)
  );
  const userTier = useMemo(() => {
    if (bulletCache?.results && Object.keys(bulletCache.results).length > 0) {
      return bulletCache.results;
    }
    const tier = getTierInfo(minYears, answers, name);
    setBulletCache({ ...bulletCache, results: tier });
    return tier;
  }, [bulletCache, minYears, answers, name, setBulletCache]);

  useEffect(() => {
    gameEntrySync.sync(answers, { ...bulletCache, results: userTier }, contact);
  }, [bulletCache, answers, contact, userTier]);

  return (
    <SummaryPageComponent
      contact={contact}
      answers={answers}
      bulletCache={bulletCache}
      isSharedView={false}
      userTier={userTier}
    />
  );
}
