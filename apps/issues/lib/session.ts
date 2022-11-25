import { unstable_getServerSession } from 'next-auth';

import { authOptions } from './auth';

export async function getRSCSession() {
  return unstable_getServerSession(authOptions);
}
