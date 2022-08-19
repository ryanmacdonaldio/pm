import { OrganizationModel } from '@pm/prisma';

import { createProtectedRouter } from '../protected-router';

export const organizationRouter = createProtectedRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      const userOrganizations = await ctx.prisma.organization.findMany({
        where: {
          UsersInOrganization: {
            some: { userId: { equals: ctx.session.user.id } },
          },
        },
      });

      return userOrganizations;
    },
  })
  .mutation('add', {
    input: OrganizationModel.omit({ id: true }),
    async resolve({ ctx, input }) {
      const organization = await ctx.prisma.organization.create({
        data: input,
      });

      return organization.id;
    },
  });
