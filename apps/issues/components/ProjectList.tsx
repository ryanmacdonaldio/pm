import { InformationCircleIcon } from '@heroicons/react/outline';
import { Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

type ProjectType = Prisma.ProjectGetPayload<{
  include: { team: { include: { user: true } }; tickets: true };
}>;

const ProfileImage = ({ src, user }: { src?: string; user: string }) => {
  return (
    <Image src={src ?? '/profile.jpg'} alt={user} height="32" width="32" />
  );
};

export default function ProjectList({ projects }: { projects: ProjectType[] }) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return (
    <table className="bg-slate-50 col-span-4 mt-4 overflow-hidden rounded-lg shadow-md text-slate-800 w-full">
      <thead className="bg-slate-100 text-slate-900">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Start Date</th>
          <th className="px-4 py-2">End Date</th>
          <th className="px-4 py-2">Team</th>
          <th className="px-4 py-2">Ticket Count</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {projects.length === 0 ? (
          <tr className="border-b">
            <td className="px-2 py-1">
              <span className="font-light italic text-slate-900">
                No Projects Found
              </span>
            </td>
          </tr>
        ) : (
          projects.map((project) => (
            <tr key={project.id} className="border-b">
              <td className="px-2 py-1">
                <div className="pl-1">{project.name}</div>
              </td>
              <td className="px-2 py-1">
                <div className="text-center">
                  {typeof project.startDate === 'undefined' ||
                  project.startDate === null
                    ? ''
                    : project.startDate.toLocaleString('en-US', dateOptions)}
                </div>
              </td>
              <td className="px-2 py-1">
                <div className="text-center">
                  {typeof project.endDate === 'undefined' ||
                  project.endDate === null
                    ? ''
                    : project.endDate.toLocaleString('en-US', dateOptions)}
                </div>
              </td>
              <td className="px-2 py-1">
                <div className="team-avatars">
                  {project.team.map(({ user }) => (
                    <ProfileImage key={user.id} user={user.name ?? user.id} />
                  ))}
                </div>
              </td>
              <td className="px-2 py-1">
                <div className="text-center">{project.tickets.length}</div>
              </td>
              <td className="px-2 py-1">
                <Link href={`/projects/${project.id}`}>
                  <InformationCircleIcon className="h-5 mx-auto w-5 hover:cursor-pointer" />
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
