import useBreakpoint from '@/hooks/useBreakpoint';
import HeroMobile from './HeroMobile';
import HeroDesktop from './HeroDesktop';

export default function HeroResponsive() {
  const { below } = useBreakpoint();
  const isMobile = below('lg');

  return isMobile ? <HeroMobile /> : <HeroDesktop />;
}
