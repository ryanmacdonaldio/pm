import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { prisma } from '../../../../lib/db';
import { withAuthentication, withMethods } from '../../../../lib/middleware';

export const schema = z.object({
  user: z.string().min(1),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'DELETE':
      try {
        const body = await schema.parse(JSON.parse(req.body));

        await prisma.usersInProject.delete({
          where: {
            projectId_userId: {
              projectId: req.query.id as string,
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
        const body = await schema.parse(JSON.parse(req.body));

        await prisma.usersInProject.create({
          data: { projectId: req.query.id as string, userId: body.user },
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

export default withMethods(['DELETE', 'POST'], withAuthentication(handler));
