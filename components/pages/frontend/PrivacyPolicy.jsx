import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';

const PrivacyPolicy = () => (
  <>
    <Header />
    <TitleSection
      name="Privacy Policy"
      content="Effective from: 01 January 2025."
    />
    <Content />
    <CommunityGallery />
    <Footer />
  </>
);
const Content = () => (
  <section>
    <div className="container-fluid mt-md-5 md-3 py-5">
      <div className="row">
        <div className="col-md-4 text-uppercase">
          <h2 className="privacy-policy__header">
            Information on <br className="d-none d-lg-block" /> data we protect
          </h2>
        </div>
        <div className="col-md-8">
          <p>
            At BALL, your privacy is of utmost importance to us. This Privacy
            Policy outlines how we collect, use, protect, and disclose your
            information when you visit or interact with our website,{' '}
            <a href="https://www.ballers.ng">https://www.ballers.ng</a>, and any
            other sites or services we own and operate. By using our website,
            you consent to the practices described in this policy.
          </p>
          <p>
            We collect personal information only when it is necessary to provide
            a service to you. This information is obtained by lawful and
            transparent means, with your full knowledge and consent. We ensure
            that you are informed of the purposes for collecting your data and
            how it will be used.
          </p>
          <p>
            We retain your personal information only as long as necessary to
            fulfill the services you have requested. Collected data is
            safeguarded using commercially reasonable methods to prevent
            unauthorized access, disclosure, alteration, or destruction.
          </p>
          <p>
            We do not share personally identifiable information with third
            parties except:
          </p>
          <ul>
            <li>When required by law, or</li>
            <li>With your explicit consent.</li>
          </ul>
          <p>
            Our website may contain links to external websites not operated by
            BALL. Please note that we are not responsible for the privacy
            practices or content of these external sites.
          </p>
          <p>
            You are not obligated to provide your personal information. However,
            refusal to do so may limit the services we can provide.
          </p>
          <p id="digital-signature">
            When utilizing digital signature functionalities on{' '}
            <a href="https://www.ballers.ng">https://www.ballers.ng</a>, you
            acknowledge and agree that:
          </p>
          <ul>
            <li>
              Your digital signature is legally binding and holds the same
              effect as a handwritten signature under applicable laws, including
              but not limited to the Electronic Transactions Act or its
              equivalent.
            </li>
            <li>
              You consent to transact electronically, accepting that agreements,
              communications, and disclosures may be provided electronically
              unless otherwise required by law.
            </li>
            <li>
              You are responsible for safeguarding the credentials or
              verification methods linked to your digital signature and ensuring
              they remain confidential.
            </li>
            <li>
              Once affixed, your digital signature is final and cannot be
              revoked unless expressly permitted by law or mutual agreement.
            </li>
            <li>
              We are not liable for unauthorized use of your digital signature
              arising from your negligence, fraud, or failure to secure your
              credentials.
            </li>
          </ul>
          <p>
            We reserve the right to update this Privacy Policy as necessary. Any
            changes will be communicated through updates to this page.
          </p>
          <p>
            If you have questions about this Privacy Policy, including how we
            handle user data, personal information, or digital signatures,
            please contact us.
          </p>
          <p>This policy is effective as of 01 December 2024.</p>
        </div>
      </div>
    </div>
  </section>
);

export default PrivacyPolicy;
