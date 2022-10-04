import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import './styles.css';
import { trpc } from '../utils/trpc';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default trpc.withTRPC(CustomApp);
