import * as z from "zod"
import { CompleteAddress, RelatedAddressModel, CompleteUser, RelatedUserModel } from "./index"

export const PersonModel = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  phone2: z.string().nullish(),
  addressId: z.string().nullish(),
})

export interface CompletePerson extends z.infer<typeof PersonModel> {
  address?: CompleteAddress | null
  user?: CompleteUser | null
}

/**
 * RelatedPersonModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPersonModel: z.ZodSchema<CompletePerson> = z.lazy(() => PersonModel.extend({
  address: RelatedAddressModel.nullish(),
  user: RelatedUserModel.nullish(),
}))
