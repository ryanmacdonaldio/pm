import { TicketModel } from '@pm/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';
import { withAuthentication, withMethods } from '../../../../lib/middleware';

export const schema = TicketModel.omit({
  createdAt: true,
  creatorId: true,
  id: true,
  projectId: true,
  title: true,
  updatedAt: true,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = await schema.parse(JSON.parse(req.body));
    const id = req.query.id as string;

    const session = (await unstable_getServerSession(
      req,
      res,
      authOptions
    )) as Session;

    const ticket = await prisma.ticket.findUnique({
      include: { ticketPriority: true, ticketStatus: true, ticketType: true },
      where: {
        id,
      },
    });

    if (!ticket) return res.status(404).end();

    if (body.ticketPriorityId !== ticket.ticketPriorityId) {
      let newValue = '';
      let newColour = 'black';
      let previousValue = '';
      let previousColour = 'black';

      if (body.ticketPriorityId) {
        const ticketPriority = await prisma.ticketPriority.findUnique({
          where: { id: body.ticketPriorityId },
        });

        if (!ticketPriority)
          return res.status(404).send('Ticket Priority not found');

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

      await prisma.ticketHistory.create({
        data: {
          changeType: 'Priority',
          newValue,
          newColour,
          previousValue,
          previousColour,
          ticketId: id,
          userId: session.user.id,
        },
      });
    }

    if (body.ticketStatusId !== ticket.ticketStatusId) {
      let newValue = '';
      let newColour = 'black';
      let previousValue = '';
      let previousColour = 'black';

      if (body.ticketStatusId) {
        const ticketStatus = await prisma.ticketStatus.findUnique({
          where: { id: body.ticketStatusId },
        });

        if (!ticketStatus)
          return res.status(404).send('Ticket Status not found');

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

      await prisma.ticketHistory.create({
        data: {
          changeType: 'Status',
          newValue,
          newColour,
          previousValue,
          previousColour,
          ticketId: id,
          userId: session.user.id,
        },
      });
    }

    if (body.ticketTypeId !== ticket.ticketTypeId) {
      let newValue = '';
      let newColour = 'black';
      let previousValue = '';
      let previousColour = 'black';

      if (body.ticketTypeId) {
        const ticketType = await prisma.ticketType.findUnique({
          where: { id: body.ticketTypeId },
        });

        if (!ticketType) return res.status(404).send('Ticket Type not found');

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

      await prisma.ticketHistory.create({
        data: {
          changeType: 'Type',
          newValue,
          newColour,
          previousValue,
          previousColour,
          ticketId: id,
          userId: session.user.id,
        },
      });
    }

    await prisma.ticket.update({
      data: body,
      where: {
        id,
      },
    });

    return res.status(200).send(ticket.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues);
    }

    return res.status(500).end();
  }
}

export default withMethods(['PATCH'], withAuthentication(handler));
