import * as z from "zod"
import { CompleteOrganization, RelatedOrganizationModel, CompleteTicket, RelatedTicketModel } from "./index"

export const TicketStatusModel = z.object({
  id: z.string(),
  value: z.string().nonempty({ message: "Value is required" }),
  organizationId: z.string(),
  colour: z.string(),
})

export interface CompleteTicketStatus extends z.infer<typeof TicketStatusModel> {
  organization: CompleteOrganization
  Ticket: CompleteTicket[]
}

/**
 * RelatedTicketStatusModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTicketStatusModel: z.ZodSchema<CompleteTicketStatus> = z.lazy(() => TicketStatusModel.extend({
  organization: RelatedOrganizationModel,
  Ticket: RelatedTicketModel.array(),
}))
