import { ProjectModel } from '@pm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { prisma } from '../../../../lib/db';
import { withAuthentication, withMethods } from '../../../../lib/middleware';

export const schema = ProjectModel.omit({
  id: true,
  name: true,
  organizationId: true,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = await schema.parse(JSON.parse(req.body));

    await prisma.project.update({
      data: { ...body },
      where: {
        id: req.query.id as string,
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

export default withMethods(['PATCH'], withAuthentication(handler));
