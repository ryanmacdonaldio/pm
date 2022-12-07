'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  TicketPriorityModel,
  TicketStatusModel,
  TicketTypeModel,
} from '@pm/prisma';
import { TicketPriority, TicketStatus, TicketType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import FormInput from './FormInput';

const Models = {
  priority: TicketPriorityModel,
  status: TicketStatusModel,
  type: TicketTypeModel,
};

async function add(
  type: 'priority' | 'status' | 'type',
  data: { colour: string; rank: number; value: string }
) {
  const urlMap = {
    priority: 'Priorities',
    status: 'Statuses',
    type: 'Types',
  };

  await fetch(`/api/tickets/ticket${urlMap[type]}`, {
    body: JSON.stringify(data),
    method: 'POST',
  });
}

export default function TicketSettingsForm({
  data,
  type,
}: {
  data: TicketPriority[] | TicketStatus[] | TicketType[];
  type: 'priority' | 'status' | 'type';
}) {
  const FormSchema = Models[type].omit({ id: true, organizationId: true });
  type FormSchemaType = z.infer<typeof FormSchema>;

  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    await add(type, data);

    reset();

    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="gap-6 grid grid-cols-3 my-4 px-6">
        <FormInput
          className="col-span-2 w-full"
          error={errors.value}
          label="Value"
          register={register('value')}
          type="text"
        />
        <FormInput
          className="col-span-3 w-full"
          error={errors.rank}
          label="Rank (lower = more important)"
          register={register('rank', { valueAsNumber: true })}
          type="text"
        />
        <FormInput
          className="col-span-3 w-full"
          error={errors.colour}
          label="Colour"
          register={register('colour')}
          type="text"
        />
      </div>
      <div className="bg-slate-100 px-8 py-4 rounded-b-md text-right">
        <button
          type="submit"
          className="bg-slate-400 font-medium px-4 py-2 rounded-md shadow-sm text-md text-slate-800 hover:bg-slate-500 hover:text-slate-900"
        >
          Create
        </button>
      </div>
    </form>
  );
}
