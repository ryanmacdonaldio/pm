'use client';

import { PencilIcon, XIcon } from '@heroicons/react/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { TicketModel } from '@pm/prisma';
import {
  Prisma,
  TicketPriority,
  TicketStatus,
  TicketType,
} from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = TicketModel.omit({
  createdAt: true,
  creatorId: true,
  id: true,
  projectId: true,
  title: true,
  updatedAt: true,
});
type FormSchemaType = z.infer<typeof FormSchema>;

type ExtendedTicketType = Prisma.TicketGetPayload<{
  include: {
    project: true;
    ticketPriority: true;
    ticketStatus: true;
    ticketType: true;
  };
}>;

async function update(id: string, data: FormSchemaType) {
  await fetch(`/api/tickets/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH',
  });
}

export default function TicketDetails({
  ticket,
  ticketPriorities,
  ticketStatuses,
  ticketTypes,
}: {
  ticket: ExtendedTicketType;
  ticketPriorities: TicketPriority[];
  ticketStatuses: TicketStatus[];
  ticketTypes: TicketType[];
}) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const router = useRouter();
  const [edit, setEdit] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({
    defaultValues: { ...ticket },
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    await update(ticket.id, data);

    router.refresh();

    setEdit(false);
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg shadow-md">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium text-xl text-slate-900">
            Ticket Details
          </span>
          <span className="font-light italic text-sm text-slate-900">
            Created on{' '}
            {new Date(ticket.createdAt).toLocaleString('en-US', dateOptions)}
            {ticket.createdAt !== ticket.updatedAt &&
              ` and Updated on ${new Date(ticket.updatedAt).toLocaleString(
                'en-US',
                dateOptions
              )}`}
          </span>
        </div>
        {edit ? (
          <button
            className="bg-red-100 border-2 border-red-400 flex h-8 items-center px-2 rounded-md space-x-1 text-red-900"
            onClick={() => {
              setEdit(false);
              reset();
            }}
          >
            <XIcon className="h-3 w-3" />
          </button>
        ) : (
          <button
            className="bg-blue-100 border-2 border-blue-400 flex h-8 items-center px-2 rounded-md space-x-1 text-blue-900"
            onClick={() => setEdit(true)}
          >
            <PencilIcon className="h-3 w-3" />
            <span>Edit</span>
          </button>
        )}
      </div>
      <form className="details-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <span>Description</span>
          {edit ? (
            <div>
              {errors.description && (
                <pre className="mr-1 text-red-700 text-sm">
                  {errors.description.message}
                </pre>
              )}
              <textarea
                className="block border border-slate-300 flex-1 outline-none px-2 py-1 rounded-none rounded-r-md focus:border-slate-400"
                {...register('description')}
              />
            </div>
          ) : (
            <span>{ticket.description}</span>
          )}
        </div>
        <div>
          <span>Ticket Priority</span>
          {edit ? (
            <div>
              {errors.ticketPriorityId && (
                <pre className="mr-1 text-red-700 text-sm">
                  {errors.ticketPriorityId.message}
                </pre>
              )}
              <select
                className="block border border-slate-300 flex-1 outline-none px-2 py-1 rounded-none rounded-r-md focus:border-slate-400"
                {...register('ticketPriorityId')}
              >
                <option value="" disabled>
                  Select a Ticket Priority
                </option>
                {ticketPriorities &&
                  ticketPriorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.value}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            ticket.ticketPriority && (
              <div className="flex flex-row items-center space-x-2">
                {ticket.ticketPriority && (
                  <div
                    className="h-2 rounded-md w-2"
                    style={{ backgroundColor: ticket.ticketPriority.colour }}
                  />
                )}
                <span>{ticket.ticketPriority.value}</span>
              </div>
            )
          )}
        </div>
        <div>
          <span>Ticket Status</span>
          {edit ? (
            <div>
              {errors.ticketStatusId && (
                <pre className="mr-1 text-red-700 text-sm">
                  {errors.ticketStatusId.message}
                </pre>
              )}
              <select
                className="block border border-slate-300 flex-1 outline-none px-2 py-1 rounded-none rounded-r-md focus:border-slate-400"
                {...register('ticketStatusId')}
              >
                <option value="" disabled>
                  Select a Ticket Status
                </option>
                {ticketStatuses &&
                  ticketStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.value}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            ticket.ticketStatus && (
              <div className="flex flex-row items-center space-x-2">
                {ticket.ticketStatus && (
                  <div
                    className="h-2 rounded-md w-2"
                    style={{ backgroundColor: ticket.ticketStatus.colour }}
                  />
                )}
                <span>{ticket.ticketStatus.value}</span>
              </div>
            )
          )}
        </div>
        <div>
          <span>Ticket Type</span>
          {edit ? (
            <div>
              {errors.ticketTypeId && (
                <pre className="mr-1 text-red-700 text-sm">
                  {errors.ticketTypeId.message}
                </pre>
              )}
              <select
                className="block border border-slate-300 flex-1 outline-none px-2 py-1 rounded-none rounded-r-md focus:border-slate-400"
                {...register('ticketTypeId')}
              >
                <option value="" disabled>
                  Select a Ticket Type
                </option>
                {ticketTypes &&
                  ticketTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.value}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            ticket.ticketType && (
              <div className="flex flex-row items-center space-x-2">
                {ticket.ticketType && (
                  <div
                    className="h-2 rounded-md w-2"
                    style={{ backgroundColor: ticket.ticketType.colour }}
                  />
                )}
                <span>{ticket.ticketType.value}</span>
              </div>
            )
          )}
        </div>
        {edit && (
          <div>
            <span>Archived</span>
            <input type="checkbox" {...register('archived')} />
          </div>
        )}
        {edit && (
          <button
            type="submit"
            className="bg-slate-400 font-medium mt-1 px-2 py-1 rounded-md shadow-sm text-md text-slate-800 hover:bg-slate-500 hover:text-slate-900"
          >
            Update
          </button>
        )}
      </form>
    </div>
  );
}
