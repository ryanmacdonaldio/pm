import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { prisma } from '../lib/db';
import { getAuthSession } from '../server/common/get-server-session';

export const requireLayoutProps =
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

    const organizations = await prisma.organization.findMany({
      where: {
        usersInOrganization: { some: { userId: { equals: session.user.id } } },
      },
    });

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
