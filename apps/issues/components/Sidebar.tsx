import {
  ArrowRightIcon,
  BookmarkIcon,
  BookOpenIcon,
  HomeIcon,
} from '@heroicons/react/outline';
import { useState } from 'react';

interface Link {
  expanded?: boolean;
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  links?: Link[];
  text: string;
  url?: string;
}

export function Sidebar() {
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

  return (
    <aside className="bg-slate-800 flex flex-col h-screen py-4 sticky text-slate-200 top-0 w-48">
      <span className="font-mono mx-8 mb-4 text-3xl text-center">Issues</span>
      <div className="border-t border-slate-400 mx-4 mb-4" />
      <ul className="mb-4 ml-3">
        {links.map((link, idx) => {
          return link.links ? (
            <li className="mb-1 ml-1">
              <div className="flex items-center mr-4 space-x-2" key={link.text}>
                {link.icon && <link.icon className="h-4 w-4" />}
                <span>{link.text}</span>
                <div className="flex-grow" />
                <ArrowRightIcon
                  className={`${
                    link.expanded && 'rotate-90'
                  } duration-500 h-3 transition-all w-3`}
                  onClick={() =>
                    setLinks(
                      links.map((check_link, check_idx) =>
                        check_idx == idx
                          ? { ...check_link, expanded: !check_link.expanded }
                          : check_link
                      )
                    )
                  }
                />
              </div>
              <ul
                className={`${
                  link.expanded ? 'max-h-24' : 'max-h-0'
                } duration-500 overflow-hidden transition-all`}
              >
                {link.links.map((sublink) => {
                  return (
                    <li className="ml-1" key={sublink.text}>
                      {sublink.text}
                    </li>
                  );
                })}
              </ul>
            </li>
          ) : (
            <li
              className="flex items-center mb-1 ml-1 space-x-2"
              key={link.text}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              <span>{link.text}</span>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-slate-400 mx-4 mb-4" />
    </aside>
  );
}
