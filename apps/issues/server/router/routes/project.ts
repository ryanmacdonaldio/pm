import { ProjectModel } from '@pm/prisma';
import { z } from 'zod';

import {
  protectedProcedure,
  protectedOrganizationProcedure,
} from '../protected-procedure';
import { t } from '../../trpc';

export const projectRouter = t.router({
  add: protectedOrganizationProcedure
    .input(ProjectModel.omit({ id: true, organizationId: true }))
    .mutation(async ({ ctx, input }) => {
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
        include: {
          tickets: {
            include: {
              assigned: true,
              ticketPriority: true,
              ticketStatus: true,
              ticketType: true,
            },
          },
        },
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
