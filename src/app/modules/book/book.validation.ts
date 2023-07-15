import { z } from 'zod'

const addNewBookZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    author: z.string({ required_error: 'Author is required' }),
    genre: z.string({ required_error: 'Genre is required' }),
    price: z.number({ required_error: 'Price is required' }).positive(),
    imageUrl: z.string().optional(),
    publishedDate: z.string({ required_error: 'Publishing date is required' }),
  }),
})

export const BookValidation = {
  addNewBookZodSchema,
}
