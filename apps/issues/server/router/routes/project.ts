import { ProjectModel } from '@pm/prisma';
import { z } from 'zod';

import { protectedProcedure } from '../protected-procedure';
import { t } from '../../trpc';
import { TRPCError } from '@trpc/server';

export const projectRouter = t.router({
  add: protectedProcedure
    .input(ProjectModel.omit({ id: true, organizationId: true }))
    .mutation(async ({ ctx, input }) => {
      if (typeof ctx.session.user.settings.organization === 'undefined') {
        throw new TRPCError({ code: 'PRECONDITION_FAILED' });
      }

      const project = await ctx.prisma.project.create({
        data: {
          ...input,
          organizationId: ctx.session.user.settings.organization,
        },
      });

      return project.id;
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
      });

      return project;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      where: {
        organizationId: { equals: ctx.session.user.settings.organization },
      },
    });

    return projects;
  }),
});
