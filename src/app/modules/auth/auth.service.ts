import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IUser } from '../user/user.interface'
import { User } from '../user//user.model'
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import { Secret } from 'jsonwebtoken'
import config from '../../../config'

const signupUser = async (user: IUser): Promise<IUser | null> => {
  const createdUser = await User.create(user)

  if (!createdUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user')
  }
  return createdUser
}

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload

  const isUserExist = await User.isUserExist(email)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  const currentUser = await User.findOne({ email })

  //create access token & refresh token
  const accessToken = jwtHelpers.createToken(
    { userId: currentUser?._id },
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in as string
  )

  const refreshToken = jwtHelpers.createToken(
    { userId: currentUser?._id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )

  return {
    accessToken,
    refreshToken,
  }
}

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    )
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token')
  }

  const { userId } = verifiedToken

  const isUserExist = await User.findOne({ _id: userId })
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist?._id,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )

  return {
    accessToken: newAccessToken,
  }
}
export const AuthService = {
  signupUser,
  loginUser,
  refreshToken,
}
