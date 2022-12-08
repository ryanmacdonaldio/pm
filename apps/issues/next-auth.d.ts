import { UsersInProject } from '@prisma/client';
import { DefaultSession } from 'next-auth';

interface Settings {
  organization?: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      admin: boolean;
      id: string;
      pm: boolean;
      settings: Settings;
    } & DefaultSession['user'];
  }

  interface User {
    settings: Settings;
  }
}
