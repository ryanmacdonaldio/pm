import { XIcon } from '@heroicons/react/outline';
import type { Dispatch, SetStateAction } from 'react';

export default function Modal({
  children,
  setShow,
  show,
}: {
  children: React.ReactNode;
  setShow: Dispatch<SetStateAction<boolean>>;
  show: boolean;
}) {
  return show ? (
    <div
      className="fixed h-full left-0 overflow-auto top-0 w-full z-10"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <XIcon
        className="bg-slate-50 cursor-pointer fixed h-8 right-1 rounded-md text-slate-900 top-1 w-8"
        onClick={() => setShow(false)}
      />
      <div className="bg-slate-50 flex flex-row justify-between mx-auto mt-48 p-4 rounded-lg w-1/3">
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
}
