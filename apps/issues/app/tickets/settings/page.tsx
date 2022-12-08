import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

import TicketSettingsForm from '../../../components/TicketSettingsForm';
import { prisma } from '../../../lib/db';
import { getSession } from '../../../lib/session';

async function getTicketPriorities(session: Session) {
  const ticketPriorities = await prisma.ticketPriority.findMany({
    where: {
      organizationId: session.user.settings.organization,
    },
  });

  return ticketPriorities;
}

async function getTicketStatuses(session: Session) {
  const ticketStatuses = await prisma.ticketStatus.findMany({
    where: {
      organizationId: session.user.settings.organization,
    },
  });

  return ticketStatuses;
}

async function getTicketTypes(session: Session) {
  const ticketTypes = await prisma.ticketType.findMany({
    where: {
      organizationId: session.user.settings.organization,
    },
  });

  return ticketTypes;
}

export default async function Page() {
  const session = await getSession();
  if (!session.user.admin) redirect('/');

  const ticketPriorities = await getTicketPriorities(session);
  const ticketStatuses = await getTicketStatuses(session);
  const ticketTypes = await getTicketTypes(session);

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">
          Ticket Settings
        </span>
      </div>
      <div className="bg-slate-50 col-span-1 flex flex-col mt-4 px-4 py-2 rounded-lg shadow-md text-slate-800">
        <span className="font-medium text-lg text-slate-900">
          Ticket Priorities
        </span>
        {ticketPriorities.length === 0 ? (
          <span className="font-light italic text-slate-900">
            No Ticket Priorities Found
          </span>
        ) : (
          ticketPriorities.map((priority) => (
            <div key={priority.id} className="flex justify-between">
              <span>
                <i>{priority.rank}.</i> {priority.value}
              </span>
              <div className="flex space-x-1">
                <PencilIcon className="h-5 text-green-700 w-5" />
                <TrashIcon className="h-5 text-red-700 w-5" />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-slate-50 col-span-3 flex flex-col mt-4 px-4 py-2 rounded-lg shadow-md text-slate-800">
        <span className="font-medium text-lg text-slate-900">New Priority</span>
        <TicketSettingsForm data={ticketPriorities} type="priority" />
      </div>
      <div className="bg-slate-50 col-span-1 flex flex-col mt-4 px-4 py-2 rounded-lg shadow-md text-slate-800">
        <span className="font-medium text-lg text-slate-900">
          Ticket Statuses
        </span>
        {ticketStatuses.length === 0 ? (
          <span className="font-light italic text-slate-900">
            No Ticket Statuses Found
          </span>
        ) : (
          ticketStatuses.map((status) => (
            <div key={status.id} className="flex justify-between">
              <span>
                <i>{status.rank}.</i> {status.value}
              </span>
              <div className="flex space-x-1">
                <PencilIcon className="h-5 text-green-700 w-5" />
                <TrashIcon className="h-5 text-red-700 w-5" />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-slate-50 col-span-3 flex flex-col mt-4 px-4 py-2 rounded-lg shadow-md text-slate-800">
        <span className="font-medium text-lg text-slate-900">New Status</span>
        <TicketSettingsForm data={ticketStatuses} type="status" />
      </div>
      <div className="bg-slate-50 col-span-1 flex flex-col mt-4 px-4 py-2 rounded-lg shadow-md text-slate-800">
        <span className="font-medium text-lg text-slate-900">Ticket Types</span>
        {ticketTypes.length === 0 ? (
          <span className="font-light italic text-slate-900">
            No Ticket Types Found
          </span>
        ) : (
          ticketTypes.map((type) => (
            <div key={type.id} className="flex justify-between">
              <span>
                <i>{type.rank}.</i> {type.value}
              </span>
              <div className="flex space-x-1">
                <PencilIcon className="h-5 text-green-700 w-5" />
                <TrashIcon className="h-5 text-red-700 w-5" />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-slate-50 col-span-3 flex flex-col mt-4 px-4 py-2 rounded-lg shadow-md text-slate-800">
        <span className="font-medium text-lg text-slate-900">New Type</span>
        <TicketSettingsForm data={ticketTypes} type="type" />
      </div>
    </div>
  );
}
