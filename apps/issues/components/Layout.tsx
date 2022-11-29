import { Organization } from '@prisma/client';
import { Session } from 'next-auth';

import { Sidebar } from './Sidebar_OLD';

export default function Layout({
  children,
  organizations,
  session,
}: {
  children: React.ReactNode;
  organizations: Organization[];
  session: Session | null;
}) {
  return (
    <div className="flex">
      <Sidebar organizations={organizations} session={session} />
      <main className="bg-slate-200 flex-grow p-4">{children}</main>
    </div>
  );
}
