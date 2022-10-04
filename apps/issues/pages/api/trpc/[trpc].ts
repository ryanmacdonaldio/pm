import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter, AppRouter } from '../../../server/router';
import { createContext } from '../../../server/router/context';

export default createNextApiHandler<AppRouter>({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error('Something went wrong', error);
    }
  },
  batching: {
    enabled: true,
  },
});
