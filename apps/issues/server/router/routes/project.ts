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
  addUser: protectedProcedure
    .input(z.object({ user: z.string().min(1), project: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.usersInProject.create({
        data: { projectId: input.project, userId: input.user },
      });
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
      include: { team: { include: { user: true } }, tickets: true },
      where: {
        organizationId: { equals: ctx.session.user.settings.organization },
      },
    });

    return projects;
  }),
  getUserProjects: protectedProcedure.query(async ({ ctx, input }) => {
    const projects = await ctx.prisma.project.findMany({
      include: { team: { include: { user: true } }, tickets: true },
      where: {
        team: { some: { userId: { equals: ctx.session.user.id } } },
      },
    });

    return projects;
  }),
  getUsers: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.user.findMany({
        where: { usersInProject: { some: { projectId: input.id } } },
      });

      return users;
    }),
  removeUser: protectedProcedure
    .input(z.object({ user: z.string(), project: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.usersInProject.delete({
        where: {
          projectId_userId: { projectId: input.project, userId: input.user },
        },
      });
    }),
  update: protectedProcedure
    .input(ProjectModel.omit({ name: true, organizationId: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      await ctx.prisma.project.update({
        data,
        where: {
          id,
        },
      });
    }),
});
