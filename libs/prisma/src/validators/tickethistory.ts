import * as z from "zod"
import { CompleteTicket, RelatedTicketModel, CompleteUser, RelatedUserModel } from "./index"

export const TicketHistoryModel = z.object({
  id: z.string(),
  changeType: z.string(),
  previousValue: z.string(),
  previousColour: z.string(),
  newValue: z.string(),
  newColour: z.string(),
  changedAt: z.date(),
  ticketId: z.string(),
  userId: z.string(),
})

export interface CompleteTicketHistory extends z.infer<typeof TicketHistoryModel> {
  ticket: CompleteTicket
  user: CompleteUser
}

/**
 * RelatedTicketHistoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTicketHistoryModel: z.ZodSchema<CompleteTicketHistory> = z.lazy(() => TicketHistoryModel.extend({
  ticket: RelatedTicketModel,
  user: RelatedUserModel,
}))
