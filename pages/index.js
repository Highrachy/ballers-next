import Header from '@/components/layout/Header';
import SearchPropertyForm from 'components/common/SearchPropertyForm';
import { PolkaDot } from '@/components/utils/Icons';

export default function Home() {
  return (
    <>
      <Header />
      <HoldingSection />
    </>
  );
}

const HoldingSection = () => (
  <section>
    <div className="row me-0 ms-0">
      <section className="col-md-6 ps-lg-6 home-hero-container">
        <div className="home-hero">
          <h1 className="text-shadow-light">
            Become <br className="d-none d-lg-block" /> a <span>Landlord</span>
          </h1>
          <p className="mt-4 text-primary">
            We make owning a home simpler and achievable.
          </p>
        </div>

        <section className="property-search__home">
          <SearchPropertyForm />
        </section>
        <div className="dotted-polka">
          <PolkaDot />
        </div>
      </section>
      <section className="col-md-6 home-bg  mb-n4"></section>
    </div>
  </section>
);
