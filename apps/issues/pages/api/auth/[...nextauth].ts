import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@pm/prisma';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      session.user.settings = user.settings;
      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
});
