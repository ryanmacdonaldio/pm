import {
  ArrowRightIcon,
  BookmarkIcon,
  BookOpenIcon,
  HomeIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { trpc } from '../utils/trpc';

type BaseLink = {
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  text: string;
  type: string;
};

interface URLLink extends BaseLink {
  type: 'url';
  url: string;
}

interface DropdownLink extends BaseLink {
  type: 'dropdown';
  expanded: boolean;
  links: Link[];
}

type Link = URLLink | DropdownLink;

export function Sidebar() {
  const { data: session } = useSession();
  const { data: organizations } = trpc.useQuery(['organization.getAll']);

  const [links, setLinks] = useState<Link[]>([
    {
      type: 'url',
      icon: HomeIcon,
      text: 'Dashboard',
      url: '/',
    },
    {
      type: 'dropdown',
      icon: BookOpenIcon,
      text: 'Projects',
      expanded: false,
      links: [
        {
          type: 'url',
          text: 'All Projects',
          url: '/projects/all',
        },
        {
          type: 'url',
          text: 'Add Project',
          url: '/projects/add',
        },
        {
          type: 'url',
          text: 'My Projects',
          url: '/projects',
        },
        {
          type: 'url',
          text: 'Archived Projects',
          url: '/projects/archive',
        },
      ],
    },
    {
      type: 'dropdown',
      icon: BookmarkIcon,
      text: 'Tickets',
      expanded: false,
      links: [
        {
          type: 'url',
          text: 'All Tickets',
          url: '/tickets/all',
        },
        {
          type: 'url',
          text: 'Add Ticket',
          url: '/ticket/add',
        },
        {
          type: 'url',
          text: 'My Tickets',
          url: '/tickets',
        },
        {
          type: 'url',
          text: 'Archived Tickets',
          url: '/tickets/archive',
        },
      ],
    },
  ]);

  return (
    <aside className="bg-slate-800 flex flex-col h-screen py-4 sticky text-slate-200 top-0 w-48">
      <span className="font-mono mx-8 mb-4 text-3xl text-center">Issues</span>
      <div className="border-t border-slate-400 mx-4 mb-4" />
      <ul className="mb-4 ml-3">
        {links.map((link, idx) => {
          return link.type === 'dropdown' ? (
            <li key={link.text} className="mb-1 ml-1">
              <div
                className="flex items-center mr-4 space-x-2 text-slate-300 hover:text-slate-100"
                key={link.text}
                onClick={() =>
                  setLinks(
                    links.map((check_link, check_idx) =>
                      check_link.type === 'dropdown' && check_idx == idx
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
      {session && organizations && organizations.length > 0 && (
        <div className="flex flex-col mb-4 mx-4 space-y-1">
          <span className="text-slate-50">Organization:</span>
          <select
            defaultValue={session.user.settings.organization ?? ''}
            className="text-slate-800 py-1"
          >
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
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
      )}
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
