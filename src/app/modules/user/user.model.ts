/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, Types, model } from 'mongoose'
import { IUser, UserModel } from './user.interface'
import uniqueValidator from 'mongoose-unique-validator'
import validator from 'validator'
import bcrypt from 'bcrypt'
import config from '../../../config'

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return validator.isEmail(value)
        },
        message: 'Invalid email address',
      },
      unique: true,
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    bookmark: {
      type: [
        {
          bookId: {
            type: Types.ObjectId,
            ref: 'Book',
            required: true,
          },
          status: {
            type: String,
            enum: ['Wishlist', 'Reading', 'Finished'],
            required: true,
          },
        },
      ],
      default: [],
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.statics.isUserExist = async function (
  email: string
): Promise<Pick<IUser, 'email' | 'password'> | null> {
  return await User.findOne({ email }, { email: 1, password: 1 })
}

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}

//unique validator for email
userSchema.plugin(uniqueValidator, {
  message: 'User already exist with same email',
})

userSchema.pre('save', async function (next) {
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  )
  next()
})

export const User = model<IUser, UserModel>('User', userSchema)
