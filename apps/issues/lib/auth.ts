import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { UsersInProject } from '@prisma/client';
import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import { prisma } from './db';
import { Settings } from '../next-auth';
import { env } from '../server/env';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user }) {
      if (!token.email) return token;

      const dbUser = await prisma.user.findUnique({
        include: { usersInProject: true },
        where: { email: token.email },
      });

      if (!dbUser) return { id: user?.id, ...token };

      const { email, id, image, name, settings, usersInProject } = dbUser;

      return {
        email,
        id,
        name,
        picture: image,
        projects: usersInProject,
        settings,
      };
    },
    async session({ session, token }) {
      if (session.user) {
        const id = token.id as string;
        const projects = token.projects as UsersInProject[];
        const settings = token.settings as Settings;

        session.user.id = id;
        session.user.settings = settings;

        const userInOrganization = await prisma.usersInOrganization.findUnique({
          where: {
            organizationId_userId: {
              organizationId: settings.organization ?? '',
              userId: id,
            },
          },
        });

        session.user.admin = userInOrganization?.admin ?? false;
        session.user.pm =
          projects.filter((project) => project.manager).length > 0;
      }

      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};
