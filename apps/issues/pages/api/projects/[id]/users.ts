import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';
import { withMethods, withProject } from '../../../../lib/middleware';

export const schema = z.object({
  user: z.string().min(1),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  const session = (await unstable_getServerSession(
    req,
    res,
    authOptions
  )) as Session;

  const projectPM = await prisma.usersInProject.findFirst({
    where: {
      manager: true,
      projectId: id,
    },
  });

  if (
    !session.user.admin &&
    (!projectPM || projectPM.userId !== session.user.id)
  )
    return res.status(403).end();

  const body = await schema.parse(JSON.parse(req.body));

  switch (req.method) {
    case 'DELETE':
      try {
        await prisma.usersInProject.delete({
          where: {
            projectId_userId: {
              projectId: id,
              userId: body.user,
            },
          },
        });

        return res.status(200).end();
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(422).json(error.issues);
        }

        return res.status(500).end();
      }
    case 'POST':
      try {
        await prisma.usersInProject.create({
          data: { projectId: id, userId: body.user },
        });

        return res.status(200).end();
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(422).json(error.issues);
        }

        return res.status(500).end();
      }
  }
}

export default withMethods(['DELETE', 'POST'], withProject(handler));
