import { Session, unstable_getServerSession } from 'next-auth';

import { authOptions } from './auth';

export async function getSession() {
  return unstable_getServerSession(authOptions) as Promise<Session>;
}
