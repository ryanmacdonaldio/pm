import { TicketStatusModel } from '@pm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';
import { withMethods, withOrganization } from '../../../../lib/middleware';

export const schema = TicketStatusModel.omit({
  id: true,
  organizationId: true,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = await schema.parse(JSON.parse(req.body));

    const session = (await unstable_getServerSession(
      req,
      res,
      authOptions
    )) as Session & { user: { settings: { organization: string } } };

    const ticketStatus = await prisma.ticketStatus.create({
      data: {
        ...body,
        organizationId: session.user.settings.organization,
      },
    });

    return res.status(200).send(ticketStatus.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues);
    }

    return res.status(500).end();
  }
}

export default withMethods(['POST'], withOrganization(handler));
