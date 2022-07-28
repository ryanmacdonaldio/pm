import { signIn, signOut, useSession } from 'next-auth/react';

export function Index() {
  const { data } = useSession();

  return (
    <>
      <h1>Issues</h1>
      {data ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </>
  );
}

export default Index;
