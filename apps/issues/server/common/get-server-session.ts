import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { authOptions as nextAuthOptions } from '../../lib/auth';

export const getAuthSession = async (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions);
};
