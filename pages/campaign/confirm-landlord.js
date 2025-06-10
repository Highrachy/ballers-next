import TitleSection from '@/components/common/TitleSection';
import Header from '@/components/layout/Header';
import dynamic from 'next/dynamic';

const ConfirmLandlordPage = dynamic(
  () => import('@/components/campaign/ConfirmLandlordPage'),
  { ssr: false }
);

export default function ConfirmLandlord() {
  return (
    <>
      <Header />
      <TitleSection
        name="Your BALL Game Plan"
        content="Turn your savings into your dream home."
      />
      <section className={`container-fluid campaign-page`}>
        <div className="row">
          <div className="col-xl-10 col-lg-11 mx-auto">
            <ConfirmLandlordPage />
          </div>
        </div>
      </section>
    </>
  );
}
