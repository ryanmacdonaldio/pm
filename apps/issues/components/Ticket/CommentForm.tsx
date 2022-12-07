'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { TicketCommentModel } from '@pm/prisma';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import FormInput from '../FormInput';

const FormSchema = TicketCommentModel.omit({
  createdAt: true,
  creatorId: true,
  id: true,
  ticketId: true,
});
type FormSchemaType = z.infer<typeof FormSchema>;

async function add(id: string, data: FormSchemaType) {
  await fetch(`/api/tickets/${id}/comments`, {
    body: JSON.stringify(data),
    method: 'POST',
  });
}

export default function CommentForm({ id }: { id: string }) {
  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    await add(id, data);

    router.refresh();

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-2">
        <FormInput
          className="w-full"
          error={errors.comment}
          label=""
          register={register('comment')}
          type="textarea"
        />
        <button
          type="submit"
          className="bg-slate-400 font-medium px-4 py-2 rounded-md shadow-sm text-md text-slate-800 hover:bg-slate-500 hover:text-slate-900"
        >
          Add
        </button>
      </div>
    </form>
  );
}
