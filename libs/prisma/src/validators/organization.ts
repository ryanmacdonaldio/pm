import * as z from "zod"
import { CompleteUsersInOrganization, RelatedUsersInOrganizationModel, CompleteProject, RelatedProjectModel, CompleteTicketPriority, RelatedTicketPriorityModel, CompleteTicketStatus, RelatedTicketStatusModel, CompleteTicketType, RelatedTicketTypeModel } from "./index"

export const OrganizationModel = z.object({
  id: z.string(),
  name: z.string().nonempty({ message: "Name is required" }),
  description: z.string().nullish(),
})

export interface CompleteOrganization extends z.infer<typeof OrganizationModel> {
  usersInOrganization: CompleteUsersInOrganization[]
  projects: CompleteProject[]
  ticketPriorities: CompleteTicketPriority[]
  ticketStatuses: CompleteTicketStatus[]
  ticketTypes: CompleteTicketType[]
}

/**
 * RelatedOrganizationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedOrganizationModel: z.ZodSchema<CompleteOrganization> = z.lazy(() => OrganizationModel.extend({
  usersInOrganization: RelatedUsersInOrganizationModel.array(),
  projects: RelatedProjectModel.array(),
  ticketPriorities: RelatedTicketPriorityModel.array(),
  ticketStatuses: RelatedTicketStatusModel.array(),
  ticketTypes: RelatedTicketTypeModel.array(),
}))
