import * as z from "zod"
import { CompleteOrganization, RelatedOrganizationModel, CompleteTicket, RelatedTicketModel } from "./index"

export const TicketPriorityModel = z.object({
  id: z.string(),
  value: z.string().nonempty({ message: "Value is required" }),
  organizationId: z.string(),
  colour: z.string(),
  rank: z.number().int(),
})

export interface CompleteTicketPriority extends z.infer<typeof TicketPriorityModel> {
  organization: CompleteOrganization
  Ticket: CompleteTicket[]
}

/**
 * RelatedTicketPriorityModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTicketPriorityModel: z.ZodSchema<CompleteTicketPriority> = z.lazy(() => TicketPriorityModel.extend({
  organization: RelatedOrganizationModel,
  Ticket: RelatedTicketModel.array(),
}))
