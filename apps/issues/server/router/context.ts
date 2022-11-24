import {
  Session,
  unstable_getServerSession as getServerSession,
} from 'next-auth';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { prisma } from '../../lib/db';
import { authOptions as nextAuthOptions } from '../../pages/api/auth/[...nextauth]';

type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const session = await getServerSession(opts.req, opts.res, nextAuthOptions);

  return await createContextInner({ session });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
