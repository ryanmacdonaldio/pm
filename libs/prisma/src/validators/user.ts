import * as z from "zod"
import { CompleteAccount, RelatedAccountModel, CompleteSession, RelatedSessionModel, CompleteUsersInOrganization, RelatedUsersInOrganizationModel, CompleteTicket, RelatedTicketModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const UserModel = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  settings: jsonSchema,
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  UsersInOrganization: CompleteUsersInOrganization[]
  TicketCreated: CompleteTicket[]
  TicketAssigned: CompleteTicket[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  accounts: RelatedAccountModel.array(),
  sessions: RelatedSessionModel.array(),
  UsersInOrganization: RelatedUsersInOrganizationModel.array(),
  TicketCreated: RelatedTicketModel.array(),
  TicketAssigned: RelatedTicketModel.array(),
}))
