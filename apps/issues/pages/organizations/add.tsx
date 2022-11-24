import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationModel } from '@pm/prisma';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import FormInput from '../../components/FormInput';
import Head from '../../components/Head';
import { trpc } from '../../lib/trpc';
import { requireLayoutProps } from '../../lib/utils';

const FormSchema = OrganizationModel.omit({ id: true });
type FormSchemaType = z.infer<typeof FormSchema>;

function Add() {
  const { isLoading, mutate } = trpc.organization.add.useMutation();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    mutate(data);

    reset();
  };

  return (
    <div className="bg-slate-200 h-screen pt-4">
      <Head title="Add Organization" />
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
              disabled={isLoading}
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default Add;
