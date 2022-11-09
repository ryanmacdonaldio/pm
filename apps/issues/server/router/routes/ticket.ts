import {
  TicketModel,
  TicketPriorityModel,
  TicketStatusModel,
  TicketTypeModel,
} from '@pm/prisma';
import { z } from 'zod';

import {
  protectedOrganizationProcedure,
  protectedProcedure,
} from '../protected-procedure';
import { t } from '../../trpc';

export const ticketRouter = t.router({
  add: protectedProcedure
    .input(
      TicketModel.omit({
        createdAt: true,
        creatorId: true,
        id: true,
        updatedAt: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.prisma.ticket.create({
        data: { ...input, creatorId: ctx.session.user.id },
      });

      return ticket.id;
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.prisma.ticket.findUnique({
        include: {
          project: true,
          ticketPriority: true,
          ticketStatus: true,
          ticketType: true,
        },
        where: { id: input.id },
      });

      return ticket;
    }),
  getAll: protectedOrganizationProcedure.query(async ({ ctx }) => {
    const tickets = await ctx.prisma.ticket.findMany({
      include: {
        project: true,
        ticketPriority: true,
        ticketStatus: true,
        ticketType: true,
      },
      where: {
        project: {
          organizationId: { equals: ctx.session.user.settings.organization },
        },
      },
    });

    return tickets;
  }),
  getUserAssignedTickets: protectedProcedure.query(async ({ ctx }) => {
    const tickets = await ctx.prisma.ticket.findMany({
      include: {
        project: true,
        ticketPriority: true,
        ticketStatus: true,
        ticketType: true,
      },
      where: {
        assignedId: { equals: ctx.session.user.id },
      },
    });

    return tickets;
  }),
  getUserSubmittedTickets: protectedProcedure.query(async ({ ctx }) => {
    const tickets = await ctx.prisma.ticket.findMany({
      include: {
        project: true,
        ticketPriority: true,
        ticketStatus: true,
        ticketType: true,
      },
      where: {
        creatorId: { equals: ctx.session.user.id },
      },
    });

    return tickets;
  }),
  priority: t.router({
    add: protectedOrganizationProcedure
      .input(TicketPriorityModel.omit({ id: true, organizationId: true }))
      .mutation(async ({ ctx, input }) => {
        const ticketPriority = await ctx.prisma.ticketPriority.create({
          data: {
            ...input,
            organizationId: ctx.session.user.settings.organization,
          },
        });

        return ticketPriority.id;
      }),
    getAll: protectedOrganizationProcedure.query(async ({ ctx }) => {
      const ticketPriorities = await ctx.prisma.ticketPriority.findMany({
        orderBy: [{ rank: 'asc' }, { value: 'asc' }],
        where: {
          organizationId: { equals: ctx.session.user.settings.organization },
        },
      });

      return ticketPriorities;
    }),
  }),
  status: t.router({
    add: protectedOrganizationProcedure
      .input(TicketStatusModel.omit({ id: true, organizationId: true }))
      .mutation(async ({ ctx, input }) => {
        const ticketStatus = await ctx.prisma.ticketStatus.create({
          data: {
            ...input,
            organizationId: ctx.session.user.settings.organization,
          },
        });

        return ticketStatus.id;
      }),
    getAll: protectedOrganizationProcedure.query(async ({ ctx }) => {
      const ticketStatuses = await ctx.prisma.ticketStatus.findMany({
        orderBy: [{ rank: 'asc' }, { value: 'asc' }],
        where: {
          organizationId: { equals: ctx.session.user.settings.organization },
        },
      });

      return ticketStatuses;
    }),
  }),
  type: t.router({
    add: protectedOrganizationProcedure
      .input(TicketTypeModel.omit({ id: true, organizationId: true }))
      .mutation(async ({ ctx, input }) => {
        const ticketType = await ctx.prisma.ticketType.create({
          data: {
            ...input,
            organizationId: ctx.session.user.settings.organization,
          },
        });

        return ticketType.id;
      }),
    getAll: protectedOrganizationProcedure.query(async ({ ctx }) => {
      const ticketTypes = await ctx.prisma.ticketType.findMany({
        orderBy: [{ rank: 'asc' }, { value: 'asc' }],
        where: {
          organizationId: { equals: ctx.session.user.settings.organization },
        },
      });

      return ticketTypes;
    }),
  }),
});
