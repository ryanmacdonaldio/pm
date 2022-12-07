import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { authOptions } from '../auth';

export function withOrganization(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).end();
    }

    if (!session.user.settings.organization) {
      return res.status(403).end();
    }

    return handler(req, res);
  };
}
