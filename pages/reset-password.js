import React from 'react';
import SeoHead from '@/components/utils/SeoHead';
import { useRouter } from 'next/router';
import ForgotPassword from '@/components/pages/auth/ForgotPassword';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  return (
    <>
      <SeoHead
        title="Reset Password — Securely Update Your BALL Account Access"
        description="Create a new password for your BALL account. This page allows you to securely reset your password using your verification token sent to your email."
        canonical="https://ballers.ng/reset-password"
        ogImage="/img/meta/reset-password.png"
        noIndex={false}
      />

      {/* Hidden SEO content to prevent low-content issues */}
      <section className="visually-hidden">
        <h2>Reset Your BALL Account Password</h2>
        <p>
          This secure password reset page allows you to create a new password
          for your BALL account using your verified reset token. The token is
          sent to your registered email address to protect your account and
          prevent unauthorized changes.
        </p>

        <p>
          If you didn’t request a password reset, simply ignore the email you
          received. Your account will remain safe and unchanged. For best
          security, always choose a strong password and keep your login details
          private.
        </p>

        <p>
          Your reset token is required to proceed:{' '}
          {token ? 'Valid token detected' : 'Token unavailable yet'}
        </p>
      </section>

      <ForgotPassword />
    </>
  );
};

export default ResetPasswordPage;
