import Header from '@/components/layout/Header';
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
      <Header />
      <HeroResponsive />;
    </>
  );
}
