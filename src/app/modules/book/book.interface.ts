import { Model, Types } from 'mongoose'
import { IUser } from '../user/user.interface'

export type IReview = {
  userId: Types.ObjectId
  description: string
}

export type IBook = {
  title: string
  author: string
  genre: string
  price: number
  imageUrl?: string
  publishedDate: Date
  publisher: Types.ObjectId | IUser
  reviews?: IReview[]
}
export type IBookFilters = {
  searchTerm?: string
  genre?: string
  publishedYear?: number
}

export type BookModel = Model<IBook>
