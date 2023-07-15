import { Schema, Types, model } from 'mongoose'
import { BookModel, IBook } from './book.interface'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    publishedDate: { type: Date, required: true },
    publisher: { type: Types.ObjectId, ref: 'User', required: true },
    reviews: [
      {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        description: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
)

bookSchema.pre('save', async function (next) {
  const bookExist = await Book.findOne({
    title: this.title,
    author: this.author,
  })
  if (bookExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `${bookExist.title} is already exist for the author ${bookExist.author}`
    )
  }
  next()
})

export const Book = model<IBook, BookModel>('Book', bookSchema)
