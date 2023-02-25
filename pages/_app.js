import UserProvider from '@/context/UserContext';
import 'assets/sass/App.scss';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
