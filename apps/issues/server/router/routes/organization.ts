import { OrganizationModel } from '@pm/prisma';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import z from 'zod';

import { protectedProcedure } from '../protected-procedure';
import { t } from '../../trpc';

export const organizationRouter = t.router({
  add: protectedProcedure
    .input(OrganizationModel.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.prisma.organization.create({
        data: input,
      });

      await ctx.prisma.usersInOrganization.create({
        data: {
          admin: true,
          organizationId: organization.id,
          userId: ctx.session.user.id,
        },
      });

      await ctx.prisma.user.update({
        data: {
          settings: {
            ...ctx.session.user.settings,
            organization: organization.id,
          } as Prisma.InputJsonValue,
        },
        where: { id: ctx.session.user.id },
      });

      return organization.id;
    }),
  change: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: input.id },
      });

      if (!organization) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      await ctx.prisma.user.update({
        data: {
          settings: {
            ...ctx.session.user.settings,
            organization: organization.id,
          } as Prisma.InputJsonValue,
        },
        where: { id: ctx.session.user.id },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userOrganizations = await ctx.prisma.organization.findMany({
      where: {
        usersInOrganization: {
          some: { userId: { equals: ctx.session.user.id } },
        },
      },
    });

    return userOrganizations;
  }),
});
