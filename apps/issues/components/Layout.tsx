import { Sidebar } from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="bg-slate-200 flex-grow p-4">{children}</main>
    </div>
  );
}
