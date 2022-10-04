import { initTRPC } from '@trpc/server';

import type { Context } from './router/context';

export const t = initTRPC.context<Context>().create({});
