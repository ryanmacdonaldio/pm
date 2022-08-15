import { DefaultSession } from 'next-auth';

interface Settings {
  organization?: number;
}

declare module 'next-auth' {
  interface Session {
    user?: {
      settings: Settings;
    } & DefaultSession['user'];
  }

  interface User {
    settings: Settings;
  }
}
