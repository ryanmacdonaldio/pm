import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { authOptions } from '../auth';
import { prisma } from '../db';

export function withProject(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).end();
    }

    const id = req.query.id as string;

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) return res.status(404).end();

    return handler(req, res);
  };
}
