import { PrismaClient } from '@prisma/client';
import { env } from 'process';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (env.NODE_END !== 'production') {
  global.prisma = prisma;
}

export * from './validators';
