import { Sidebar } from '../components/Sidebar';

export function Index() {
  return (
    <div className="flex">
      <Sidebar />
      <main>
        <h1>Issues</h1>
      </main>
    </div>
  );
}

export default Index;
