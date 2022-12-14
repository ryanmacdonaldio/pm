import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type ListValue = {
  id: string;
  value: string;
};

type FormInputProps = {
  className?: string;
  defaultListValue?: string | null;
  error: FieldError | undefined;
  label: string;
  listValues?: ListValue[];
  register: UseFormRegisterReturn;
  type: string;
};

function FormInput({
  className,
  defaultListValue,
  error,
  label,
  listValues,
  register,
  type,
}: FormInputProps) {
  const renderInput = () => {
    switch (type) {
      case 'checkbox':
        return (
          <div className="flex mt-1">
            <input type="checkbox" className="h-5 ml-1 w-5" {...register} />
          </div>
        );
      case 'list':
        return listValues ? (
          <div className="flex mt-1">
            <select
              defaultValue={
                defaultListValue
                  ? listValues
                      .map((listValue) => listValue.id)
                      .includes(defaultListValue)
                    ? defaultListValue
                    : ''
                  : ''
              }
              className="block border border-slate-300 flex-1 outline-none px-3 py-2 rounded-none rounded-r-md w-full"
              {...register}
            >
              <option value="" disabled>
                Select a {label.toLowerCase()}...
              </option>
              {listValues.map((listValue) => (
                <option key={listValue.id} value={listValue.id}>
                  {listValue.value}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="bg-white block border border-slate-300 flex-1 mt-1 outline-none px-3 py-2 rounded-none rounded-r-md w-full">
            listValues required!
          </div>
        );
      case 'textarea':
        return (
          <div className="flex mt-1 rounded-md shadow-sm">
            <textarea
              className="block border border-slate-300 flex-1 outline-none px-3 py-2 rounded-none rounded-r-md w-full focus:border-slate-400"
              {...register}
            ></textarea>
          </div>
        );
      default:
        return (
          <div className="flex mt-1 rounded-md shadow-sm">
            <input
              type={type}
              className="block border border-slate-300 flex-1 outline-none px-3 py-2 rounded-none rounded-r-md w-full focus:border-slate-400"
              {...register}
            />
          </div>
        );
    }
  };

  return (
    <div className={className}>
      <label className="block font-medium text-slate-600">{label}</label>
      {renderInput()}
      {error && <pre className="text-red-700">{error.message}</pre>}
    </div>
  );
}

export default FormInput;
