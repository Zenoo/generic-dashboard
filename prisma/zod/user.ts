import * as z from "zod"
import { Lang } from "@prisma/client"
import { CompletePerson, RelatedPersonModel, CompleteRecord, RelatedRecordModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  lang: z.nativeEnum(Lang),
  login: z.string().max(255),
  admin: z.boolean(),
  password: z.string().max(255),
  active: z.boolean(),
  personId: z.string(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  person: CompletePerson
  records: CompleteRecord[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  person: RelatedPersonModel,
  records: RelatedRecordModel.array(),
}))
