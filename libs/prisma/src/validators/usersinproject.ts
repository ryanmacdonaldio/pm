import * as z from "zod"
import { CompleteProject, RelatedProjectModel, CompleteUser, RelatedUserModel } from "./index"

export const UsersInProjectModel = z.object({
  projectId: z.string(),
  userId: z.string(),
  manager: z.boolean(),
})

export interface CompleteUsersInProject extends z.infer<typeof UsersInProjectModel> {
  project: CompleteProject
  user: CompleteUser
}

/**
 * RelatedUsersInProjectModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUsersInProjectModel: z.ZodSchema<CompleteUsersInProject> = z.lazy(() => UsersInProjectModel.extend({
  project: RelatedProjectModel,
  user: RelatedUserModel,
}))
