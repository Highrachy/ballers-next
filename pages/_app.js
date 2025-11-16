import UserProvider from '@/context/UserContext';
import NextNProgress from 'nextjs-progressbar';
import { isDevEnvironment } from '@/utils/helpers';
import 'assets/sass/import.css';
import 'assets/sass/App.scss';
import { ReactQueryDevtools } from 'react-query-devtools';
import Head from 'next/head';
import Script from 'next/script';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FloatingChatButton from '@/components/common/Whatsapp';
import { ChatMessageProvider } from '@/context/ChatContext';
import { SSRProvider } from 'react-bootstrap';

function MyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH}>
        <UserProvider>
          <ChatMessageProvider>
            <NextNProgress color="#5775fa" />
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
            {isDevEnvironment() && <ReactQueryDevtools />}
          </ChatMessageProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </SSRProvider>
  );
}

export default MyApp;
