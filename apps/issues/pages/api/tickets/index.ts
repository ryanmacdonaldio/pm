import { TicketModel } from '@pm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/db';
import { withAuthentication, withMethods } from '../../../lib/middleware';

export const schema = TicketModel.omit({
  createdAt: true,
  creatorId: true,
  id: true,
  updatedAt: true,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = await schema.parse(JSON.parse(req.body));

    const session = (await unstable_getServerSession(
      req,
      res,
      authOptions
    )) as Session;

    const ticket = await prisma.ticket.create({
      data: { ...body, creatorId: session.user.id },
    });

    if (body.ticketPriorityId) {
      const ticketPriority = await prisma.ticketPriority.findUnique({
        where: { id: body.ticketPriorityId },
      });

      if (!ticketPriority)
        return res.status(404).send('Ticket Priority not found');

      await prisma.ticketHistory.create({
        data: {
          changeType: 'Priority',
          newColour: ticketPriority.colour,
          newValue: ticketPriority.value,
          previousColour: 'black',
          previousValue: 'Nil',
          ticketId: ticket.id,
          userId: session.user.id,
        },
      });
    }

    if (body.ticketStatusId) {
      const ticketStatus = await prisma.ticketStatus.findUnique({
        where: { id: body.ticketStatusId },
      });

      if (!ticketStatus) return res.status(404).send('Ticket Status not found');

      await prisma.ticketHistory.create({
        data: {
          changeType: 'Status',
          newColour: ticketStatus.colour,
          newValue: ticketStatus.value,
          previousColour: 'black',
          previousValue: 'Nil',
          ticketId: ticket.id,
          userId: session.user.id,
        },
      });
    }

    if (body.ticketTypeId) {
      const ticketType = await prisma.ticketType.findUnique({
        where: { id: body.ticketTypeId },
      });

      if (!ticketType) return res.status(404).send('Ticket Type not found');

      await prisma.ticketHistory.create({
        data: {
          changeType: 'Type',
          newColour: ticketType.colour,
          newValue: ticketType.value,
          previousColour: 'black',
          previousValue: 'Nil',
          ticketId: ticket.id,
          userId: session.user.id,
        },
      });
    }

    return res.send(ticket.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues);
    }

    return res.status(500).end();
  }
}

export default withMethods(['POST'], withAuthentication(handler));
