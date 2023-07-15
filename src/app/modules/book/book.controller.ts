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

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await BookService.getSingleBook(id)

  sendResponse<IBook>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Book retrieved successfully',
    data: result,
  })
})

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const payload = req.body

  const result = await BookService.updateBook(id, payload)

  sendResponse<IBook>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Book updated successfully',
    data: result,
  })
})

const addReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const payload = req.body
  console.log(payload)
  const newReview = { ...payload, userId: req.user?.userId }

  const result = await BookService.addReview(id, newReview)

  sendResponse<IBook>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review added successfully',
    data: result,
  })
})

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await BookService.deleteBook(id)

  sendResponse<IBook>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Book deleted successfully',
    data: result,
  })
})

export const BookController = {
  addNewBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  addReview,
  deleteBook,
}
