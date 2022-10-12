import * as z from "zod"
import { CompleteOrganization, RelatedOrganizationModel, CompleteTicket, RelatedTicketModel } from "./index"

export const ProjectModel = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string().nonempty({ message: "Name is required" }),
  description: z.string().nullish(),
  startDate: z.date().nullish(),
  endDate: z.date().nullish(),
  archived: z.boolean(),
})

export interface CompleteProject extends z.infer<typeof ProjectModel> {
  organization: CompleteOrganization
  tickets: CompleteTicket[]
}

/**
 * RelatedProjectModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProjectModel: z.ZodSchema<CompleteProject> = z.lazy(() => ProjectModel.extend({
  organization: RelatedOrganizationModel,
  tickets: RelatedTicketModel.array(),
}))
