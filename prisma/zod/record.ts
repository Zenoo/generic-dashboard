import * as z from "zod"
import { RecordAction, RecordObject } from "@prisma/client"
import { CompleteUser, RelatedUserModel } from "./index"

export const RecordModel = z.object({
  id: z.string(),
  date: z.date(),
  action: z.nativeEnum(RecordAction),
  object: z.nativeEnum(RecordObject),
  objectId: z.string(),
  key: z.string().nullish(),
  oldValue: z.string().nullish(),
  newValue: z.string().nullish(),
  authorId: z.string(),
})

export interface CompleteRecord extends z.infer<typeof RecordModel> {
  author: CompleteUser
}

/**
 * RelatedRecordModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRecordModel: z.ZodSchema<CompleteRecord> = z.lazy(() => RecordModel.extend({
  author: RelatedUserModel,
}))
