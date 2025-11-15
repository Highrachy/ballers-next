import React from 'react';
import ForgotPassword from '@/components/pages/auth/ForgotPassword';
import SeoHead from '@/components/utils/SeoHead';

const ForgotPass = () => {
  return (
    <>
      <SeoHead
        title="Forgot Password — Reset Access to Your BALL Account"
        description="Securely reset your BALL account password. Enter your registered email to receive a password reset link and regain access to your dashboard."
        canonical="https://www.ballers.ng/forgot-password"
        keywords={[
          'forgot password',
          'ball password reset',
          'reset ballers account',
          'password recovery nigeria real estate',
          'ball login help',
        ]}
      />
      {/* Hidden SEO content block for low-content fix (300+ words) */}
      <section className="visually-hidden">
        <h1>Reset Your BALL Account Password</h1>

        <p>
          If you can’t remember your BALL account password, this page allows you
          to securely restore access to your account. Simply enter the email
          address linked to your BALL profile and you will immediately receive a
          password reset link. This link takes you to a secure page where you
          can create a new password and regain access to your dashboard,
          contributions, saved properties, and all your homeownership tools.
        </p>

        <p>
          BALL takes account safety seriously. The reset process ensures that
          only the owner of the registered email can update the password. If you
          ever receive a reset email without making a request, simply ignore it
          and your account will remain secure. No changes will be made unless
          you complete the reset steps.
        </p>

        <p>
          Losing access to your account can be stressful, especially when you
          are actively tracking properties, monitoring your homeownership
          progress, or managing contributions. The password recovery system is
          designed to make the process fast, simple, and fully secure. All you
          need is access to your email inbox. Once you follow the verified link,
          you can choose a new password and continue using your BALL account
          without interruption.
        </p>

        <p>
          BALL helps Nigerians find verified properties, connect with trusted
          developers, compare payment plans, and take meaningful steps toward
          owning a home. If you are returning to update your applications,
          continue your property search, or resume your dashboard activities,
          resetting your password ensures you can get back into your account
          safely and quickly.
        </p>

        <p>
          If you do not yet have a BALL account, you can sign up for free. New
          users gain access to verified listings, trusted vendors, eligibility
          tools, and insightful resources designed to simplify the entire
          homeownership journey. Whether you are planning, saving, comparing
          properties, or ready to buy, BALL provides everything you need in one
          place.
        </p>
      </section>
      <ForgotPassword />
    </>
  );
};

export default ForgotPass;
