import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/db';
import { withCurrentUser, withMethods } from '../../../../../lib/middleware';

export const schema = z.object({
  organizationId: z.string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = await schema.parse(JSON.parse(req.body));

    const session = (await unstable_getServerSession(
      req,
      res,
      authOptions
    )) as Session;

    const organization = await prisma.organization.findUnique({
      where: {
        id: query.organizationId,
      },
    });

    if (!organization) {
      return res.status(404).end();
    }

    await prisma.user.update({
      data: {
        settings: {
          ...session.user.settings,
          organization: organization.id,
        } as Prisma.InputJsonValue,
      },
      where: {
        id: session.user.id,
      },
    });

    return res.status(200).send(organization.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues);
    }

    return res.status(500).end();
  }
}

export default withMethods(['PUT'], withCurrentUser(handler));
