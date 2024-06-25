import * as z from "zod"
import { RequestStatus } from "@prisma/client"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const RequestModel = z.object({
  id: z.string(),
  date: z.date(),
  status: z.nativeEnum(RequestStatus),
  response: jsonSchema,
})
