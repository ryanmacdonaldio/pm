import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { getAuthSession } from '../server/common/get-server-session';
import { prisma } from '../server/db/client';

const requireLayoutProps =
  (gssp: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getAuthSession(ctx);

    if (!session) {
      return {
        redirect: {
          destination: '/api/auth/signin',
          permanent: false,
        },
      };
    }

    const organizations = await prisma.organization.findMany();

    const gsspProps = await gssp(ctx);

    if ('props' in gsspProps) {
      return {
        props: { ...gsspProps.props, organizations, session },
      };
    } else {
      return {
        props: { organizations, session },
      };
    }
  };

export default requireLayoutProps;
