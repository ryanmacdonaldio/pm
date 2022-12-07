import { TicketCommentModel } from '@pm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';
import { withAuthentication, withMethods } from '../../../../lib/middleware';

export const schema = TicketCommentModel.omit({
  createdAt: true,
  creatorId: true,
  id: true,
  ticketId: true,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = await schema.parse(JSON.parse(req.body));

    const session = (await unstable_getServerSession(
      req,
      res,
      authOptions
    )) as Session;

    const ticketComment = await prisma.ticketComment.create({
      data: {
        ...body,
        creatorId: session.user.id,
        ticketId: req.query.id as string,
      },
    });

    return res.status(200).send(ticketComment.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues);
    }

    return res.status(500).end();
  }
}

export default withMethods(['POST'], withAuthentication(handler));
