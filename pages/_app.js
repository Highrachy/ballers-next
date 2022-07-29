import 'assets/sass/App.scss';
import { Slide, ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* <ToastContainer autoClose={10000} transition={Slide} theme="light" /> */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
