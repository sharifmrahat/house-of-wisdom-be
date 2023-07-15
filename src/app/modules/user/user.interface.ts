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
  isUserExist(phonNumber: string): Promise<Pick<IUser, 'email' | 'password'>>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<IUser>
