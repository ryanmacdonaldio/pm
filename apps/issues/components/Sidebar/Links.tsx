'use client';

import {
  ArrowRightIcon,
  BookmarkIcon,
  BookOpenIcon,
  HomeIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import { useState } from 'react';

type BaseLink = {
  admin?: boolean;
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  pm?: boolean;
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
  links: URLLink[];
}

type Link = URLLink | DropdownLink;

export function SidebarLinks({ admin, pm }: { admin: boolean; pm: boolean }) {
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
          admin: true,
          type: 'url',
          text: 'All Projects',
          url: '/projects/all',
        },
        {
          admin: true,
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
          pm: true,
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
          pm: true,
          type: 'url',
          text: 'All Tickets',
          url: '/tickets/all',
        },
        {
          type: 'url',
          text: 'Add Ticket',
          url: '/tickets/add',
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
        {
          admin: true,
          type: 'url',
          text: 'Ticket Settings',
          url: '/tickets/settings',
        },
      ],
    },
  ]);

  return (
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
                link.expanded ? 'max-h-64' : 'max-h-0'
              } duration-500 overflow-hidden transition-all`}
            >
              {link.links.map((sublink) => {
                return (!sublink.admin || admin) &&
                  (!sublink.pm || pm || admin) ? (
                  <li
                    className="ml-1 text-slate-300 hover:text-slate-100"
                    key={sublink.text}
                  >
                    <Link href={sublink.url}>{sublink.text}</Link>
                  </li>
                ) : (
                  ''
                );
              })}
            </ul>
          </li>
        ) : (!link.admin || admin) && (!link.pm || pm || admin) ? (
          <li
            className="flex items-center mb-1 ml-1 space-x-2 text-slate-300 hover:text-slate-100"
            key={link.text}
          >
            {link.icon && <link.icon className="h-4 w-4" />}
            <Link href={link.url}>
              {link.text} {link.admin}
            </Link>
          </li>
        ) : (
          ''
        );
      })}
    </ul>
  );
}
