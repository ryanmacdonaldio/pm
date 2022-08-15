import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      settings: object;
    } & DefaultSession['user'];
  }

  interface User {
    settings: object;
  }
}
