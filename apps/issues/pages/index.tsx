import { signIn, signOut, useSession } from 'next-auth/react';

import { Sidebar } from '../components/Sidebar';

export function Index() {
  const { data } = useSession();

  return (
    <div className="flex">
      <Sidebar />
      <main>
        <h1>Issues</h1>
        {data ? (
          <button onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </main>
    </div>
  );
}

export default Index;
