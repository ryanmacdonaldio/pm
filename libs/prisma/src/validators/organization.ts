import * as z from "zod"
import { CompleteUsersInOrganization, RelatedUsersInOrganizationModel } from "./index"

export const OrganizationModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
})

export interface CompleteOrganization extends z.infer<typeof OrganizationModel> {
  UsersInOrganization: CompleteUsersInOrganization[]
}

/**
 * RelatedOrganizationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedOrganizationModel: z.ZodSchema<CompleteOrganization> = z.lazy(() => OrganizationModel.extend({
  UsersInOrganization: RelatedUsersInOrganizationModel.array(),
}))
