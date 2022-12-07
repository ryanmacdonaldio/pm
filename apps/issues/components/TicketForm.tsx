'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { TicketModel } from '@pm/prisma';
import type {
  Project,
  TicketPriority,
  TicketStatus,
  TicketType,
} from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import FormInput from './FormInput';

const FormSchema = TicketModel.omit({
  createdAt: true,
  creatorId: true,
  id: true,
  updatedAt: true,
});
type FormSchemaType = z.infer<typeof FormSchema>;

async function add(data: FormSchemaType) {
  const res = await fetch('/api/tickets', {
    body: JSON.stringify(data),
    method: 'POST',
  });

  return await res.text();
}

export default function TicketForm({
  projects,
  ticketPriorities,
  ticketStatuses,
  ticketTypes,
}: {
  projects: Project[];
  ticketPriorities: TicketPriority[];
  ticketStatuses: TicketStatus[];
  ticketTypes: TicketType[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const project_id = searchParams.get('project_id');

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const ticketID = await add(data);

    reset();

    router.push(`/tickets/${ticketID}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-slate-50 mx-auto rounded-md shadow-md w-2/3">
        <div className="col-span-3 border-b font-medium p-4 text-slate-700 text-xl w-full">
          New Ticket
        </div>
        <div className="gap-6 grid grid-cols-3 my-4 px-6">
          <FormInput
            className="col-span-2 w-full"
            error={errors.title}
            label="Title"
            register={register('title')}
            type="text"
          />
          <FormInput
            className="col-span-3 w-full"
            error={errors.description}
            label="Description"
            register={register('description')}
            type="textarea"
          />
          <FormInput
            className="col-span-3 w-full"
            defaultListValue={project_id}
            error={errors.projectId}
            label="Project"
            listValues={projects.map((project) => ({
              id: project.id,
              value: project.name,
            }))}
            register={register('projectId')}
            type="list"
          />
          <FormInput
            className="col-span-3 w-full"
            error={errors.ticketPriorityId}
            label="Ticket Priority"
            listValues={ticketPriorities.map((ticketPriority) => ({
              id: ticketPriority.id,
              value: ticketPriority.value,
            }))}
            register={register('ticketPriorityId')}
            type="list"
          />
          <FormInput
            className="col-span-3 w-full"
            error={errors.ticketStatusId}
            label="Ticket Status"
            listValues={ticketStatuses.map((ticketStatus) => ({
              id: ticketStatus.id,
              value: ticketStatus.value,
            }))}
            register={register('ticketStatusId')}
            type="list"
          />
          <FormInput
            className="col-span-3 w-full"
            error={errors.ticketTypeId}
            label="Ticket Type"
            listValues={ticketTypes.map((ticketType) => ({
              id: ticketType.id,
              value: ticketType.value,
            }))}
            register={register('ticketTypeId')}
            type="list"
          />
          <FormInput
            className="col-span-3 w-full"
            error={errors.archived}
            label="Archived"
            register={register('archived')}
            type="checkbox"
          />
        </div>
        <div className="bg-slate-100 px-8 py-4 rounded-b-md text-right">
          <button
            type="submit"
            className="bg-slate-400 font-medium px-4 py-2 rounded-md shadow-sm text-md text-slate-800 hover:bg-slate-500 hover:text-slate-900"
            disabled={false}
          >
            Create
          </button>
        </div>
      </div>
    </form>
  );
}
