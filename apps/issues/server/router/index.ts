import { t } from '../trpc';
import { organizationRouter } from './routes/organization';

export const appRouter = t.router({
  organization: organizationRouter,
});

export type AppRouter = typeof appRouter;
