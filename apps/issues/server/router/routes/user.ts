import { protectedOrganizationProcedure } from '../protected-procedure';
import { t } from '../../trpc';

export const userRouter = t.router({
  getAll: protectedOrganizationProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        usersInOrganization: {
          some: { organizationId: ctx.session.user.settings.organization },
        },
      },
    });

    return users;
  }),
});
