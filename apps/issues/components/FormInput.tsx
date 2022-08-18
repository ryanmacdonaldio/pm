import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type FormInputProps = {
  className?: string;
  error: FieldError | undefined;
  label: string;
  register: UseFormRegisterReturn;
  type: string;
};

function FormInput({
  className,
  error,
  label,
  register,
  type,
}: FormInputProps) {
  return (
    <div className={className}>
      <label className="block font-medium text-slate-600">{label}</label>
      <div className="flex mt-1 rounded-md shadow-sm">
        {type === 'textarea' ? (
          <textarea
            className="block border border-slate-300 flex-1 outline-none px-3 py-2 rounded-none rounded-r-md w-full focus:border-slate-400"
            {...register}
          ></textarea>
        ) : (
          <input
            type={type}
            className="block border border-slate-300 flex-1 outline-none px-3 py-2 rounded-none rounded-r-md w-full focus:border-slate-400"
            {...register}
          />
        )}
      </div>
      {error && <pre className="text-red-700">{error.message}</pre>}
    </div>
  );
}

export default FormInput;
