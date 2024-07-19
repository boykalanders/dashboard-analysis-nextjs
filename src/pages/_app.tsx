import '@/styles/globals.css';
import '@/styles/ContactForm.css';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { DefaultSeo } from 'next-seo';
import MainLayout from '@/components/MainLayout';
import Footer from '@/components/Footer';

import SEO from '@/components/next-seo.config';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <div className='flex flex-col min-h-screen'>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
}
