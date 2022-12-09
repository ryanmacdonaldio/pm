import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { authOptions } from '../auth';
import { prisma } from '../db';

export function withTicket(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).end();
    }

    const id = req.query.id as string;

    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
    });

    if (!ticket) return res.status(404).end();

    return handler(req, res);
  };
}
