import { Schema, Types, model } from 'mongoose'
import { BookModel, IBook } from './book.interface'

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
  publishedDate: { type: Date, required: true },
  publisher: { type: Types.ObjectId, ref: 'User', required: true },
  reviews: [
    {
      userId: { type: Types.ObjectId, ref: 'User', required: true },
      description: { type: String, required: true },
    },
  ],
})

bookSchema.statics.isBookExist = async function (
  title: string
): Promise<IBook | null> {
  return await Book.findOne({ title })
}

export const Book = model<IBook, BookModel>('Book', bookSchema)
