import { organizationRouter } from './routes/organization';
import { projectRouter } from './routes/project';
import { ticketRouter } from './routes/ticket';
import { userRouter } from './routes/user';
import { t } from '../trpc';

export const appRouter = t.router({
  organization: organizationRouter,
  project: projectRouter,
  ticket: ticketRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
