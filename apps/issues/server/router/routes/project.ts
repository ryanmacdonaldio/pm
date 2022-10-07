import { ProjectModel } from '@pm/prisma';

import { protectedProcedure } from '../protected-procedure';
import { t } from '../../trpc';
import { TRPCError } from '@trpc/server';

export const projectRouter = t.router({
  add: protectedProcedure
    .input(ProjectModel.omit({ id: true, organizationId: true }))
    .mutation(async ({ ctx, input }) => {
      if (typeof ctx.session.user.settings.organization === 'undefined') {
        throw new TRPCError({ code: 'PRECONDITION_FAILED' });
      }

      const project = await ctx.prisma.project.create({
        data: {
          ...input,
          organizationId: ctx.session.user.settings.organization,
        },
      });

      return project.id;
    }),
});
