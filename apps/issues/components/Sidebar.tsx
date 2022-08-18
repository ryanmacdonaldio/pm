import {
  ArrowRightIcon,
  BookmarkIcon,
  BookOpenIcon,
  HomeIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

interface Link {
  expanded?: boolean;
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  links?: Link[];
  text: string;
  url?: string;
}

interface Organization {
  id: number;
  name: string;
}

export function Sidebar({ session }: { session: Session }) {
  const [links, setLinks] = useState<Link[]>([
    {
      icon: HomeIcon,
      text: 'Dashboard',
      url: '/',
    },
    {
      icon: BookOpenIcon,
      text: 'Projects',
      expanded: false,
      links: [
        {
          text: 'All Projects',
          url: '/projects/all',
        },
        {
          text: 'Add Project',
          url: '/projects/add',
        },
        {
          text: 'My Projects',
          url: '/projects',
        },
        {
          text: 'Archived Projects',
          url: '/projects/archive',
        },
      ],
    },
    {
      icon: BookmarkIcon,
      text: 'Tickets',
      expanded: false,
      links: [
        {
          text: 'All Tickets',
          url: '/tickets/all',
        },
        {
          text: 'Add Ticket',
          url: '/ticket/add',
        },
        {
          text: 'My Tickets',
          url: '/tickets',
        },
        {
          text: 'Archived Tickets',
          url: '/tickets/archive',
        },
      ],
    },
  ]);

  const organizations: Organization[] = [
    {
      id: 1,
      name: 'Organization 1',
    },
    {
      id: 2,
      name: 'Organization 2',
    },
    {
      id: 3,
      name: 'Organization 3',
    },
    {
      id: 4,
      name: 'Organization 4',
    },
  ];

  return (
    <aside className="bg-slate-800 flex flex-col h-screen py-4 sticky text-slate-200 top-0 w-48">
      <span className="font-mono mx-8 mb-4 text-3xl text-center">Issues</span>
      <div className="border-t border-slate-400 mx-4 mb-4" />
      <ul className="mb-4 ml-3">
        {links.map((link, idx) => {
          return link.links ? (
            <li key={link.text} className="mb-1 ml-1">
              <div
                className="flex items-center mr-4 space-x-2 text-slate-300 hover:text-slate-100"
                key={link.text}
                onClick={() =>
                  setLinks(
                    links.map((check_link, check_idx) =>
                      check_idx == idx
                        ? { ...check_link, expanded: !check_link.expanded }
                        : check_link
                    )
                  )
                }
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                <span>{link.text}</span>
                <div className="flex-grow" />
                <ArrowRightIcon
                  className={`${
                    link.expanded && 'rotate-90'
                  } duration-500 h-3 transition-transform w-3`}
                />
              </div>
              <ul
                className={`${
                  link.expanded ? 'max-h-24' : 'max-h-0'
                } duration-500 overflow-hidden transition-all`}
              >
                {link.links.map((sublink) => {
                  return (
                    <li
                      className="ml-1 text-slate-300 hover:text-slate-100"
                      key={sublink.text}
                    >
                      {sublink.text}
                    </li>
                  );
                })}
              </ul>
            </li>
          ) : (
            <li
              className="flex items-center mb-1 ml-1 space-x-2 text-slate-300 hover:text-slate-100"
              key={link.text}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              <Link href={link.url}>{link.text}</Link>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-slate-400 mx-4 mb-4" />
      <div className="flex-grow" />
      <div className="flex flex-col mb-4 mx-4 space-y-1">
        <span className="text-slate-50">Organization:</span>
        <select className="text-slate-800 py-1">
          {organizations.map((organization) => (
            <option
              key={organization.id}
              value={organization.id}
              selected={
                session &&
                session.user.settings.organization === organization.id
              }
            >
              {organization.name}
            </option>
          ))}
        </select>
        <Link href="/organizations/add">
          <button className="bg-slate-100 border-2 border-slate-400 flex items-center justify-center px-3 py-1 rounded-md space-x-2 text-slate-900 text-sm">
            <PlusIcon className="h-3 w-3" />
            <span>Create</span>
          </button>
        </Link>
      </div>
      <div className="border-t border-slate-400 mx-4 mb-4" />
      {session ? (
        <button
          className="bg-slate-600 mx-4 p-2 rounded-md hover:bg-slate-700"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      ) : (
        <button
          className="bg-slate-600 mx-4 p-2 rounded-md hover:bg-slate-700"
          onClick={() => signIn()}
        >
          Sign In
        </button>
      )}
    </aside>
  );
}
