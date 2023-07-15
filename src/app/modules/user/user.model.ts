import { Schema, Types, model } from 'mongoose'
import { IUser, UserModel } from './user.interface'
import uniqueValidator from 'mongoose-unique-validator'
import validator from 'validator'

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
): Promise<Pick<IUser, 'email'> | null> {
  return await User.findOne({ email }, { email: 1 })
}

//unique validator for email
userSchema.plugin(uniqueValidator, {
  message: 'User already exist with same email',
})

export const User = model<IUser, UserModel>('User', userSchema)
