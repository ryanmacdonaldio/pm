import * as z from "zod"
import { CompleteProject, RelatedProjectModel, CompleteUser, RelatedUserModel, CompleteTicketPriority, RelatedTicketPriorityModel, CompleteTicketStatus, RelatedTicketStatusModel, CompleteTicketType, RelatedTicketTypeModel, CompleteTicketComment, RelatedTicketCommentModel } from "./index"

export const TicketModel = z.object({
  id: z.string(),
  projectId: z.string().nonempty({ message: "Please choose a project" }),
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  archived: z.boolean(),
  creatorId: z.string(),
  assignedId: z.string().nullish(),
  ticketPriorityId: z.string().nullish(),
  ticketStatusId: z.string().nullish(),
  ticketTypeId: z.string().nullish(),
})

export interface CompleteTicket extends z.infer<typeof TicketModel> {
  project: CompleteProject
  creator: CompleteUser
  assigned?: CompleteUser | null
  ticketPriority?: CompleteTicketPriority | null
  ticketStatus?: CompleteTicketStatus | null
  ticketType?: CompleteTicketType | null
  TicketComment: CompleteTicketComment[]
}

/**
 * RelatedTicketModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTicketModel: z.ZodSchema<CompleteTicket> = z.lazy(() => TicketModel.extend({
  project: RelatedProjectModel,
  creator: RelatedUserModel,
  assigned: RelatedUserModel.nullish(),
  ticketPriority: RelatedTicketPriorityModel.nullish(),
  ticketStatus: RelatedTicketStatusModel.nullish(),
  ticketType: RelatedTicketTypeModel.nullish(),
  TicketComment: RelatedTicketCommentModel.array(),
}))
