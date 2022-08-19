import * as z from "zod"
import { CompleteOrganization, RelatedOrganizationModel, CompleteUser, RelatedUserModel } from "./index"

export const UsersInOrganizationModel = z.object({
  organizationId: z.string(),
  userId: z.string(),
  admin: z.boolean(),
})

export interface CompleteUsersInOrganization extends z.infer<typeof UsersInOrganizationModel> {
  organization: CompleteOrganization
  user: CompleteUser
}

/**
 * RelatedUsersInOrganizationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUsersInOrganizationModel: z.ZodSchema<CompleteUsersInOrganization> = z.lazy(() => UsersInOrganizationModel.extend({
  organization: RelatedOrganizationModel,
  user: RelatedUserModel,
}))
