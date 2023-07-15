import { z } from 'zod'

const updateProfileZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    bookmark: z
      .array(
        z.object({
          bookId: z.string().nonempty(),
          status: z.enum(['Wishlist', 'Reading', 'Finished']),
        })
      )
      .optional(),
  }),
})

export const UserValidation = {
  updateProfileZodSchema,
}
