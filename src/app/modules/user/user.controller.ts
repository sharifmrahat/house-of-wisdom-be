/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from './user.interface'
import { UserService } from './user.service'

const getMyProfileUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const result = await UserService.getMyProfile(user)

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User information retrieved successfully',
    data: result,
  })
})

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId
  const payload = req.body

  const result = await UserService.updateProfile(id, payload)

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User information updated successfully',
    data: result,
  })
})

export const UserController = {
  getMyProfileUser,
  updateProfile,
}
