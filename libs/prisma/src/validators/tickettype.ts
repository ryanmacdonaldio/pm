import * as z from "zod"
import { CompleteOrganization, RelatedOrganizationModel, CompleteTicket, RelatedTicketModel } from "./index"

export const TicketTypeModel = z.object({
  id: z.string(),
  value: z.string().nonempty({ message: "Value is required" }),
  organizationId: z.string(),
  colour: z.string(),
})

export interface CompleteTicketType extends z.infer<typeof TicketTypeModel> {
  organization: CompleteOrganization
  Ticket: CompleteTicket[]
}

/**
 * RelatedTicketTypeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTicketTypeModel: z.ZodSchema<CompleteTicketType> = z.lazy(() => TicketTypeModel.extend({
  organization: RelatedOrganizationModel,
  Ticket: RelatedTicketModel.array(),
}))
