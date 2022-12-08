import type { Session } from 'next-auth';
import React, { cache } from 'react';

import { SidebarLinks } from '../components/Sidebar/Links';
import { SidebarOrganizations } from '../components/Sidebar/Organizations';
import { SidebarSignOut } from '../components/Sidebar/SignOut';
import { prisma } from '../lib/db';
import { getSession } from '../lib/session';

import './global.css';

const getOrganizations = cache(async (session: Session) => {
  const organizations = await prisma.organization.findMany({
    where: {
      usersInOrganization: {
        some: { userId: { equals: session.user.id } },
      },
    },
  });

  return organizations;
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const organizations = await getOrganizations(session);

  const { admin, pm } = session.user;

  return (
    <html lang="en">
      <body>
        <div className="flex">
          <aside className="bg-slate-800 flex flex-col h-screen py-4 sticky text-slate-200 top-0 w-48">
            <span className="font-mono mx-8 mb-4 text-3xl text-center">
              Issues
            </span>
            <div className="border-t border-slate-400 mx-4 mb-4" />
            <SidebarLinks admin={admin} pm={pm} />
            <div className="border-t border-slate-400 mx-4 mb-4" />
            <div className="flex-grow" />
            {organizations.length > 0 && (
              <SidebarOrganizations
                organizations={organizations}
                session={session}
              />
            )}
            <div className="border-t border-slate-400 mx-4 mb-4" />
            <SidebarSignOut />
          </aside>
          <main className="bg-slate-200 flex-grow p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
