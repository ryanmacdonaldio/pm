import { TicketModel } from '@pm/prisma';
import { TRPCError } from '@trpc/server';

import { protectedProcedure } from '../protected-procedure';
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
  priority: t.router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (typeof ctx.session.user.settings.organization === 'undefined') {
        throw new TRPCError({ code: 'PRECONDITION_FAILED' });
      }

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
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (typeof ctx.session.user.settings.organization === 'undefined') {
        throw new TRPCError({ code: 'PRECONDITION_FAILED' });
      }

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
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (typeof ctx.session.user.settings.organization === 'undefined') {
        throw new TRPCError({ code: 'PRECONDITION_FAILED' });
      }

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
