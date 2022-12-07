'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationModel } from '@pm/prisma';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import FormInput from './FormInput';

const FormSchema = OrganizationModel.omit({ id: true });
type FormSchemaType = z.infer<typeof FormSchema>;

async function add(data: FormSchemaType) {
  await fetch(`/api/organizations`, {
    body: JSON.stringify(data),
    method: 'POST',
  });
}

export default function OrganizationForm() {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    await add(data);

    reset();

    // TODO: invalidate user organization when it becomes available
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-slate-50 mx-auto rounded-md shadow-md w-2/3">
        <div className="col-span-3 border-b font-medium p-4 text-slate-700 text-xl w-full">
          New Organization
        </div>
        <div className="gap-6 grid grid-cols-3 my-4 px-6">
          <FormInput
            className="col-span-2 w-full"
            error={errors.name}
            label="Name"
            register={register('name')}
            type="text"
          />
          <FormInput
            className="col-span-3 w-full"
            error={errors.description}
            label="Description"
            register={register('description')}
            type="textarea"
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
      </div>
    </form>
  );
}
