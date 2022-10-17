import { TRPCError } from '@trpc/server';
import { t } from '../trpc';

const isLoggedIn = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      // infers that session is non-nullable to downstream resolvers
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(isLoggedIn);

const hasOrganization = t.middleware(async ({ ctx, next }) => {
  if (typeof ctx.session?.user.settings.organization === 'undefined') {
    throw new TRPCError({ code: 'PRECONDITION_FAILED' });
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          settings: {
            ...ctx.session.user.settings,
            organization: ctx.session.user.settings.organization,
          },
        },
      },
    },
  });
});

export const protectedOrganizationProcedure = t.procedure
  .use(isLoggedIn)
  .use(hasOrganization);
