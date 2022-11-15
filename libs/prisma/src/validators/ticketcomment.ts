import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteTicket, RelatedTicketModel } from "./index"

export const TicketCommentModel = z.object({
  id: z.string(),
  comment: z.string().nonempty({ message: "Comment is required" }),
  createdAt: z.date(),
  creatorId: z.string(),
  ticketId: z.string(),
})

export interface CompleteTicketComment extends z.infer<typeof TicketCommentModel> {
  creator: CompleteUser
  ticket: CompleteTicket
}

/**
 * RelatedTicketCommentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTicketCommentModel: z.ZodSchema<CompleteTicketComment> = z.lazy(() => TicketCommentModel.extend({
  creator: RelatedUserModel,
  ticket: RelatedTicketModel,
}))
