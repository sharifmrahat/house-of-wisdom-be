import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from '../user/user.interface'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import config from '../../../config'
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface'

const signupUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.body
    const result = await AuthService.signupUser(user)

    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User created successfully',
      data: result,
    })
  }
)

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginData = req.body
  const result = await AuthService.loginUser(loginData)
  const { refreshToken, ...others } = result

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: others,
  })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies

  const result = await AuthService.refreshToken(refreshToken)

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'New access token generated successfully!',
    data: result,
  })
})

export const AuthController = {
  signupUser,
  loginUser,
  refreshToken,
}
