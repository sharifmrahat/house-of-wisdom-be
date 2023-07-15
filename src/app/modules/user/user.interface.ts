import { Model, Types } from 'mongoose'

export type IBookmark = {
  bookId: Types.ObjectId
  status: 'Wishlist' | 'Reading' | 'Finished'
}

export type IUser = {
  name: string
  email: string
  password: string
  bookmark?: IBookmark[]
}

export type UserModel = {
  isUserExist(phonNumber: string): Promise<Pick<IUser, 'email'>>
} & Model<IUser>
