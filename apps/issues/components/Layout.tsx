import { Session } from 'next-auth';

import { Sidebar } from './Sidebar';

export default function Layout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <div className="flex">
      <Sidebar session={session} />
      <main className="bg-slate-200 flex-grow p-4">{children}</main>
    </div>
  );
}
