import { Organization } from '@prisma/client';
import { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import Layout from '../components/Layout';
import { trpc } from '../lib/trpc';

import './styles.css';

interface PageProps {
  organizations: Organization[];
  session: Session | null;
}

function CustomApp({ Component, pageProps }: AppProps<PageProps>) {
  const { organizations, session } = pageProps;

  return (
    <SessionProvider session={session}>
      <Layout organizations={organizations} session={session}>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default trpc.withTRPC(CustomApp);
