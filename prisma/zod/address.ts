import * as z from "zod"
import { CompletePerson, RelatedPersonModel } from "./index"

export const AddressModel = z.object({
  id: z.string(),
  streetNumber: z.string(),
  street: z.string(),
  zip: z.string(),
  city: z.string(),
  country: z.string(),
  placeId: z.string(),
})

export interface CompleteAddress extends z.infer<typeof AddressModel> {
  person?: CompletePerson | null
}

/**
 * RelatedAddressModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAddressModel: z.ZodSchema<CompleteAddress> = z.lazy(() => AddressModel.extend({
  person: RelatedPersonModel.nullish(),
}))
