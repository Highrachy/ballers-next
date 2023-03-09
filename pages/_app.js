import UserProvider from '@/context/UserContext';
import { isDevEnvironment } from '@/utils/helpers';
import 'assets/sass/App.scss';
import { ReactQueryDevtools } from 'react-query-devtools';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
      {isDevEnvironment() && <ReactQueryDevtools />}
    </UserProvider>
  );
}

export default MyApp;
