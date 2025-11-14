import Header from '@/components/layout/Header';
import SeoHead from '@/components/utils/SeoHead';
import dynamic from 'next/dynamic';

const HeroResponsive = dynamic(
  () => import('@/components/game/hero/HeroResponsive'),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <>
      <SeoHead
        title="Are you a Baller Game Center"
        description="Play the BALL homeownership readiness games and discover your financial profile, buying style, and path to owning a home."
        noIndex={false}
      />
      <Header />
      <HeroResponsive />;
    </>
  );
}
