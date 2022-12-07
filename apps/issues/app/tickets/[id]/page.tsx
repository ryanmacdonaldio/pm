import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';

import TicketDetails from '../../../components/TicketDetails';
import CommentForm from '../../../components/Ticket/CommentForm';
import { prisma } from '../../../lib/db';
import { getSession } from '../../../lib/session';

interface PageProps {
  params: {
    id: string;
  };
}

async function getTicket(id: string) {
  const ticket = await prisma.ticket.findUnique({
    include: {
      comments: {
        include: { creator: true },
        orderBy: [{ createdAt: 'desc' }],
      },
      history: {
        include: { user: true },
        orderBy: [{ changedAt: 'desc' }],
      },
      project: true,
      ticketPriority: true,
      ticketStatus: true,
      ticketType: true,
    },
    where: { id },
  });

  return ticket;
}

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

export default async function Page({ params: { id } }: PageProps) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const ticket = await getTicket(id);

  if (!ticket) {
    redirect('/');
  }

  const session = await getSession();
  const ticketPriorities = await getTicketPriorities(session);
  const ticketStatuses = await getTicketStatuses(session);
  const ticketTypes = await getTicketTypes(session);

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <div className="flex space-x-2 text-2xl text-slate-900">
          <Link href={`/projects/${ticket.projectId}`}>
            <span className="cursor-pointer font-light">
              {ticket.project.name}
            </span>
          </Link>
          <span className=" font-normal">&gt;</span>
          <span className=" font-medium">{ticket.title}</span>
        </div>
      </div>
      <div className="col-span-1 flex flex-col space-y-4">
        <TicketDetails
          ticket={ticket}
          ticketPriorities={ticketPriorities}
          ticketStatuses={ticketStatuses}
          ticketTypes={ticketTypes}
        />
      </div>
      <div className="col-span-2">
        <div className="bg-slate-50 col-span-1 flex flex-col p-4 rounded-lg shadow-md space-y-2">
          <span className="font-medium text-xl text-slate-900">History</span>
          {ticket.history.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {ticket.history.map((history) => {
                const changedAt = new Date(history.changedAt);

                const previousDiv =
                  history.previousValue !== 'Nil' ? (
                    <div className="bg-slate-200 flex flex-row items-center mx-2 px-1 rounded-md space-x-2">
                      <div
                        className="h-2 rounded-md w-2"
                        style={{
                          backgroundColor: history.previousColour,
                        }}
                      />
                      <span>{history.previousValue}</span>
                    </div>
                  ) : (
                    <></>
                  );

                const newDiv =
                  history.newValue !== 'Nil' ? (
                    <div className="bg-slate-200 flex flex-row items-center mx-2 px-1 rounded-md space-x-2">
                      <div
                        className="h-2 rounded-md w-2"
                        style={{
                          backgroundColor: history.newColour,
                        }}
                      />
                      <span>{history.newValue}</span>
                    </div>
                  ) : (
                    <></>
                  );

                return (
                  <div key={history.id} className="flex flex-col">
                    <div className="flex items-center justify-between space-x-2">
                      <span>{history.user.name}</span>
                      <span className="font-light italic text-sm text-slate-900">
                        {changedAt.toLocaleString('en-US', dateOptions)}
                      </span>
                    </div>
                    <div className="flex">
                      {`${history.changeType} ${
                        history.previousValue === 'Nil'
                          ? 'set to'
                          : history.newValue === 'Nil'
                          ? 'removed (was'
                          : 'changed from'
                      }`}
                      {history.previousValue === 'Nil' ? newDiv : previousDiv}
                      {history.previousValue !== 'Nil'
                        ? history.newValue === 'Nil'
                          ? ')'
                          : 'to'
                        : ''}
                      {history.previousValue !== 'Nil' &&
                        history.newValue !== 'Nil' &&
                        newDiv}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="font-light italic text-slate-900">
              No History Found
            </span>
          )}
        </div>
      </div>
      <div>
        <div className="bg-slate-50 col-span-1 mb-4 p-4 rounded-lg shadow-md">
          <span className="font-medium text-xl text-slate-900">
            Add Comment
          </span>
          <CommentForm id={id} />
        </div>
        <div className="bg-slate-50 col-span-1 flex flex-col p-4 rounded-lg shadow-md space-y-2">
          <span className="font-medium text-xl text-slate-900">Comments</span>
          {ticket.comments?.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {ticket.comments.map((comment) => {
                const createdAt = new Date(comment.createdAt);
                return (
                  <div key={comment.id} className="flex flex-col">
                    <div className="flex items-center justify-between space-x-2">
                      <span>{comment.creator.name}</span>
                      <span className="font-light italic text-sm text-slate-900">
                        {createdAt.toLocaleString('en-US', dateOptions)}
                      </span>
                    </div>
                    <div>{comment.comment}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="font-light italic text-slate-900">
              No Comments Found
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
