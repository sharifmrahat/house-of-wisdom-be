import { Model, Types } from 'mongoose'
import { IBook } from '../book/book.interface'

export type IBookmark = {
  bookId: Types.ObjectId | IBook
  status: 'Wishlist' | 'Reading' | 'Finished'
}

export type IUser = {
  name: string
  email: string
  password: string
  photoUrl: string
  bookmark?: IBookmark[]
}

export type UserModel = {
  isUserExist(email: string): Promise<Pick<IUser, 'email' | 'password'>>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<IUser>
