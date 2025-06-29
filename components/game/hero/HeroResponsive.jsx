import useBreakpoint from '@/hooks/useBreakpoint';
import HeroMobile from './HeroMobile';
import HeroDesktop from './HeroDesktop';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import { useEffect } from 'react';
import { STORAGE } from '../shared/helper';

export default function HeroResponsive() {
  const { below } = useBreakpoint();
  const isMobile = below('lg');
  const [contact, setContact] = useLocalStorageState(STORAGE.CONTACT, {});

  useEffect(() => {
    if (!contact.id) {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
      setContact({ id });
    }
  }, [contact, setContact]);

  return isMobile ? <HeroMobile /> : <HeroDesktop />;
}
