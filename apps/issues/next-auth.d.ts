import { DefaultSession } from 'next-auth';

interface Settings {
  organization?: number;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      settings: Settings;
    } & DefaultSession['user'];
  }

  interface User {
    settings: Settings;
  }
}
