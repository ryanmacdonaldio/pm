import {
  TicketCommentModel,
  TicketModel,
  TicketPriorityModel,
  TicketStatusModel,
  TicketTypeModel,
} from '@pm/prisma';
import { TRPCError } from '@trpc/server';
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

      if (input.ticketPriorityId) {
        const ticketPriority = await ctx.prisma.ticketPriority.findUnique({
          where: { id: input.ticketPriorityId },
        });

        if (!ticketPriority) throw new TRPCError({ code: 'BAD_REQUEST' });

        await ctx.prisma.ticketHistory.create({
          data: {
            changeType: 'Priority',
            newColour: ticketPriority.colour,
            newValue: ticketPriority.value,
            previousColour: 'black',
            previousValue: 'Nil',
            ticketId: ticket.id,
            userId: ctx.session.user.id,
          },
        });
      }

      if (input.ticketStatusId) {
        const ticketStatus = await ctx.prisma.ticketStatus.findUnique({
          where: { id: input.ticketStatusId },
        });

        if (!ticketStatus) throw new TRPCError({ code: 'BAD_REQUEST' });

        await ctx.prisma.ticketHistory.create({
          data: {
            changeType: 'Status',
            newColour: ticketStatus.colour,
            newValue: ticketStatus.value,
            previousColour: 'black',
            previousValue: 'Nil',
            ticketId: ticket.id,
            userId: ctx.session.user.id,
          },
        });
      }

      if (input.ticketTypeId) {
        const ticketType = await ctx.prisma.ticketType.findUnique({
          where: { id: input.ticketTypeId },
        });

        if (!ticketType) throw new TRPCError({ code: 'BAD_REQUEST' });

        await ctx.prisma.ticketHistory.create({
          data: {
            changeType: 'Type',
            newColour: ticketType.colour,
            newValue: ticketType.value,
            previousColour: 'black',
            previousValue: 'Nil',
            ticketId: ticket.id,
            userId: ctx.session.user.id,
          },
        });
      }

      return ticket.id;
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.prisma.ticket.findUnique({
        include: {
          comments: {
            include: { creator: true },
            orderBy: [{ createdAt: 'desc' }],
          },
          history: {
            include: { user: true },
            orderBy: [{ changedAt: 'desc' }],
          },
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
  update: protectedProcedure
    .input(
      TicketModel.omit({
        createdAt: true,
        creatorId: true,
        projectId: true,
        title: true,
        updatedAt: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const ticket = await ctx.prisma.ticket.findUnique({
        include: { ticketPriority: true, ticketStatus: true, ticketType: true },
        where: { id },
      });

      if (!ticket) throw new TRPCError({ code: 'BAD_REQUEST' });

      if (data.ticketPriorityId !== ticket?.ticketPriorityId) {
        let newValue = '';
        let newColour = 'black';
        let previousValue = '';
        let previousColour = 'black';

        if (data.ticketPriorityId) {
          const ticketPriority = await ctx.prisma.ticketPriority.findUnique({
            where: { id: data.ticketPriorityId },
          });

          if (!ticketPriority) throw new TRPCError({ code: 'BAD_REQUEST' });

          newValue = ticketPriority.value;
          newColour = ticketPriority.colour;
        } else {
          newValue = 'Nil';
        }

        if (ticket.ticketPriority) {
          previousValue = ticket.ticketPriority.value;
          previousColour = ticket.ticketPriority.colour;
        } else {
          previousValue = 'Nil';
        }

        await ctx.prisma.ticketHistory.create({
          data: {
            changeType: 'Priority',
            newValue,
            newColour,
            previousValue,
            previousColour,
            ticketId: id,
            userId: ctx.session.user.id,
          },
        });
      }

      if (data.ticketStatusId !== ticket?.ticketStatusId) {
        let newValue = '';
        let newColour = 'black';
        let previousValue = '';
        let previousColour = 'black';

        if (data.ticketStatusId) {
          const ticketStatus = await ctx.prisma.ticketStatus.findUnique({
            where: { id: data.ticketStatusId },
          });

          if (!ticketStatus) throw new TRPCError({ code: 'BAD_REQUEST' });

          newValue = ticketStatus.value;
          newColour = ticketStatus.colour;
        } else {
          newValue = 'Nil';
        }

        if (ticket.ticketStatus) {
          previousValue = ticket.ticketStatus.value;
          previousColour = ticket.ticketStatus.colour;
        } else {
          previousValue = 'Nil';
        }

        await ctx.prisma.ticketHistory.create({
          data: {
            changeType: 'Status',
            newValue,
            newColour,
            previousValue,
            previousColour,
            ticketId: id,
            userId: ctx.session.user.id,
          },
        });
      }
      if (data.ticketTypeId !== ticket?.ticketTypeId) {
        let newValue = '';
        let newColour = 'black';
        let previousValue = '';
        let previousColour = 'black';

        if (data.ticketTypeId) {
          const ticketType = await ctx.prisma.ticketType.findUnique({
            where: { id: data.ticketTypeId },
          });

          if (!ticketType) throw new TRPCError({ code: 'BAD_REQUEST' });

          newValue = ticketType.value;
          newColour = ticketType.colour;
        } else {
          newValue = 'Nil';
        }

        if (ticket.ticketType) {
          previousValue = ticket.ticketType.value;
          previousColour = ticket.ticketType.colour;
        } else {
          previousValue = 'Nil';
        }

        await ctx.prisma.ticketHistory.create({
          data: {
            changeType: 'Type',
            newValue,
            newColour,
            previousValue,
            previousColour,
            ticketId: id,
            userId: ctx.session.user.id,
          },
        });
      }

      await ctx.prisma.ticket.update({
        data,
        where: {
          id,
        },
      });
    }),
  comment: t.router({
    add: protectedProcedure
      .input(
        TicketCommentModel.omit({ createdAt: true, creatorId: true, id: true })
      )
      .mutation(async ({ ctx, input }) => {
        const ticketComment = await ctx.prisma.ticketComment.create({
          data: {
            ...input,
            creatorId: ctx.session.user.id,
          },
        });

        return ticketComment;
      }),
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
