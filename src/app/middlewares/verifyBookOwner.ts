import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../config'
import ApiError from '../../errors/ApiError'
import { jwtHelpers } from '../../helpers/jwtHelpers'
import { Book } from '../modules/book/book.model'

const verifyBookOwner =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
      }

      let verifiedUser = null

      verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_secret as Secret
      )

      req.user = verifiedUser

      const selectedBook = await Book.findOne({ _id: req.params.id })
      if (!selectedBook) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Book is not found')
      }

      const isVerifiedSeller =
        verifiedUser.userId === selectedBook?.publisher.toString()

      if (!isVerifiedSeller) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access Forbidden')
      }
      next()
    } catch (error) {
      next(error)
    }
  }

export default verifyBookOwner
