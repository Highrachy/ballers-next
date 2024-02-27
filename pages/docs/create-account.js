import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Image from 'next/image';

const AboutUs = () => (
  <>
    <Header />
    <TitleSection
      name="Getting Started"
      content="The only realistic burden free process of owning your ideal home."
    />
    <OurGoalAndPromise />
    <CommunityGallery />
    <Footer />
  </>
);

const OurGoalAndPromise = () => (
  <section className="row mt-5">
    <div className="container my-md-5 my-3 py-5 px-8 terms-of-use">
      <h3>Creating Your BALL Account</h3>
      <p className="mt-3 lead">
        Welcome to BALL! To begin your journey towards homeownership and real
        estate success, you&apos;ll need to create a personal account on our
        platform. Follow the simple steps below to get started:
      </p>

      <ol className="doc-counter">
        <li>
          <strong>Visit the Registration Page</strong>
          <p>
            Navigate to the BALL website at{' '}
            <a href="https://ballers.ng/">https://ballers.ng/</a> and locate the
            &quot;Register for Free&quot; button. Click on it to proceed to the
            registration page.
          </p>
        </li>
        <li>
          <strong>Provide Your Information</strong>
          <p>
            On the registration page, you&apos;ll be prompted to provide the
            following information:
          </p>
          <ul>
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Password</li>
            <li>Phone Number (Optional)</li>
          </ul>

          <Image
            src="/img/docs/register.png"
            alt="Nnamdi Ijei"
            width="1487"
            height=" 847"
            className="img-fluid bordered my-5"
          />
        </li>
        <li>
          <strong>Verify Your Email Address</strong>
          <p>
            After submitting your registration information, you&apos;ll receive
            a verification email at the address you provided. Click on the
            verification link in the email to confirm your email address and
            activate your BALL account.
          </p>
        </li>
        <li>
          <strong>Complete Your Profile</strong>
          <p>
            Once your email address is verified, you&apos;ll be directed to
            complete your profile. This may include providing additional details
            such as your address, occupation, and preferences related to
            homeownership.
          </p>
        </li>
        <li>
          <strong>Agree to Terms and Conditions</strong>
          <p>
            Review BALL&apos;s Terms of Service and Privacy Policy, then check
            the box to indicate that you agree to abide by them. These documents
            outline your rights and responsibilities as a BALL user.
          </p>
        </li>
        <li>
          <strong>Verify Your Identity (if required)</strong>
          <p>
            In some cases, BALL may require additional verification steps to
            confirm your identity and ensure the security of your account. This
            may involve providing additional documents or completing a
            verification process.
          </p>
        </li>
        <li>
          <strong>Start Exploring!</strong>
          <p>
            Congratulations! Your BALL account is now set up and ready to use.
            Log in to your account to start exploring properties, managing your
            payments, and connecting with other members of the BALL community.
          </p>
        </li>
      </ol>
    </div>
  </section>
);

export default AboutUs;
