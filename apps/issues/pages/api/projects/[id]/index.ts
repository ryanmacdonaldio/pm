import { ProjectModel } from '@pm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';
import { withMethods, withProject } from '../../../../lib/middleware';

export const schema = ProjectModel.omit({
  id: true,
  name: true,
  organizationId: true,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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

    await prisma.project.update({
      data: { ...body },
      where: {
        id,
      },
    });

    return res.status(200).end();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json(error.issues);
    }

    return res.status(500).end();
  }
}

export default withMethods(['PATCH'], withProject(handler));
