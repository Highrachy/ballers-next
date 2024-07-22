import UserProvider from '@/context/UserContext';
import NextNProgress from 'nextjs-progressbar';
import { isDevEnvironment } from '@/utils/helpers';
import { DefaultSeo } from 'next-seo';
import 'assets/sass/import.css';
import 'assets/sass/App.scss';
import { ReactQueryDevtools } from 'react-query-devtools';
import Head from 'next/head';
import Script from 'next/script';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FloatingChatButton from '@/components/common/Whatsapp';
import { ChatMessageProvider } from '@/context/ChatContext';

function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH}>
      <UserProvider>
        <ChatMessageProvider>
          <NextNProgress color="#5775fa" />
          <DefaultSeo
            defaultTitle="Become A Landlord (BALL) - Own Your Dream Home with Ease"
            description="BALL (Become A Landlord) is the innovative online platform that simplifies the process of owning your dream home. Start your journey to homeownership, make convenient contributions, and access a wealth of real estate knowledge. Join the community of Ballers and unlock the path to a million new homeowners. Visit us at BALLers.ng."
          />
          <Head>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <meta
              name="keywords"
              content="Become A Landlord, own dream home, homeownership, convenient contributions, real estate knowledge, referral program, community, property investment, property acquisition, Ballers, emerging homeowners"
            />
          </Head>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <Script
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
            page_path: window.location.pathname,
          });
          `,
            }}
          />
          <Component {...pageProps} />
          <FloatingChatButton />
          <FloatingChatButton />
          {isDevEnvironment() && <ReactQueryDevtools />}
        </ChatMessageProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default MyApp;
