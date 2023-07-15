import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { BookService } from './book.service'
import { IBook } from './book.interface'
import pick from '../../../shared/pick'
import { bookFilterableFields } from './book.constant'
import { paginationFields } from '../../../constants/pagination'

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

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await BookService.getAllBooks(filters, paginationOptions)

  sendResponse<IBook[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Books retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})

export const BookController = {
  addNewBook,
  getAllBooks,
}
