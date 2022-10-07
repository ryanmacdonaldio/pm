import { organizationRouter } from './routes/organization';
import { projectRouter } from './routes/project';
import { t } from '../trpc';

export const appRouter = t.router({
  organization: organizationRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
