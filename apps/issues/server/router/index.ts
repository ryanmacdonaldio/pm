import { createRouter } from './context';
import { organizationRouter } from './routes/organization';

export const appRouter = createRouter().merge(
  'organization.',
  organizationRouter
);

export type AppRouter = typeof appRouter;
