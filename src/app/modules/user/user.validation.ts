import { z } from 'zod'

const updateProfileZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    photoUrl: z.string().optional(),
  }),
})

const updateBookmarkZodSchema = z.object({
  body: z.object({
    status: z.enum(['Wishlist', 'Reading', 'Finished']),
  }),
})

export const UserValidation = {
  updateProfileZodSchema,
  updateBookmarkZodSchema,
}
