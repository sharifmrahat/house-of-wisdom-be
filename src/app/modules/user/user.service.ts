import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IUser } from './user.interface'
import { User } from './user.model'
import { JwtPayload } from 'jsonwebtoken'

const getMyProfile = async (user: JwtPayload | null): Promise<IUser | null> => {
  const result = await User.findOne({ _id: user?.userId }).select({
    name: 1,
    email: 1,
    bookmark: 1,
  })
  return result
}

const updateProfile = async (
  userId: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: userId })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User is not found!')
  }

  const result = await User.findOneAndUpdate({ _id: userId }, payload, {
    new: true,
  }).select({ name: 1, email: 1, bookmark: 1 })
  return result
}

export const UserService = {
  getMyProfile,
  updateProfile,
}
