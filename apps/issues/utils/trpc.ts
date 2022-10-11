import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';

import { AppRouter } from '../server/router';

// export const trpc = createReactQueryHooks<AppRouter>();

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 4200}`; // developement SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          headers() {
            if (ctx?.req) {
              const { connection: _connection, ...headers } = ctx.req.headers;

              return { ...headers, 'x-ssr': 1 };
            }

            return {};
          },
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: true,
});
