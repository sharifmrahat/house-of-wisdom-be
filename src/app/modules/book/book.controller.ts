import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { BookService } from './book.service'
import { IBook } from './book.interface'

const addNewBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body
    const book = { ...data, publisher: req.user?.userId }
    const result = await BookService.addNewBook(book)

    sendResponse<IBook>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Book added successfully',
      data: result,
    })
  }
)

export const BookController = {
  addNewBook,
}
