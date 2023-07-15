import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IBook, IBookFilters, IReview } from './book.interface'
import { Book } from './book.model'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { bookSearchableFields } from './book.constant'
import { SortOrder } from 'mongoose'

const addNewBook = async (book: IBook): Promise<IBook | null> => {
  const createdBook = await Book.create(book)

  if (!createdBook) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to add book')
  }
  return await Book.findOne({ _id: createdBook._id }).populate(
    'publisher',
    '-password -bookmark'
  )
}

const getAllBooks = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === 'publishedYear') {
          const year = typeof value === 'string' ? parseInt(value) : value
          const startDate = new Date(year, 0, 1)
          const endDate = new Date(year, 11, 31)
          return { publishedDate: { $gte: startDate, $lte: endDate } }
        } else {
          return { [field]: { $regex: value, $options: 'i' } }
        }
      }),
    })
  }

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await Book.find(whereConditions)
    .populate('publisher', '-password -bookmark')
    .populate({
      path: 'reviews',
      populate: [{ path: 'user', select: { password: 0, bookmark: 0 } }],
    })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await Book.countDocuments(whereConditions)

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const getSingleBook = async (_id: string): Promise<IBook | null> => {
  const result = await Book.findOne({ _id })
    .populate('publisher', '-password -bookmark')
    .populate({
      path: 'reviews',
      populate: [{ path: 'user', select: { password: 0, bookmark: 0 } }],
    })
  return result
}

const updateBook = async (
  _id: string,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  const isExist = await Book.findOne({ _id })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book is not found!')
  }

  const result = await Book.findOneAndUpdate({ _id }, payload, {
    new: true,
  })
    .populate('publisher', '-password -bookmark')
    .populate({
      path: 'reviews',
      populate: [{ path: 'user', select: { password: 0, bookmark: 0 } }],
    })

  return result
}

const addReview = async (
  _id: string,
  newReview: IReview
): Promise<IBook | null> => {
  const isExist = await Book.findOne({ _id })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book is not found!')
  }

  let reviewQuery = {}
  let reviewData = {}

  const reviewExist = await Book.findOne({
    _id,
    'reviews.user': newReview.user,
  })

  if (reviewExist) {
    reviewQuery = { _id, 'reviews.user': newReview.user }
    reviewData = { $set: { 'reviews.$.description': newReview.description } }
  } else {
    reviewQuery = { _id }
    reviewData = { $push: { bookmark: newReview } }
  }

  const result = await Book.findOneAndUpdate(reviewQuery, reviewData, {
    new: true,
  })
    .populate('publisher', '-password -bookmark')
    .populate({
      path: 'reviews',
      populate: [{ path: 'user', select: { password: 0, bookmark: 0 } }],
    })

  return result
}

const deleteBook = async (_id: string): Promise<IBook | null> => {
  const isExist = await Book.findOne({ _id })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book is not found!')
  }

  const result = await Book.findByIdAndDelete(_id)
    .populate('publisher', '-password -bookmark')
    .populate({
      path: 'reviews',
      populate: [{ path: 'user', select: { password: 0, bookmark: 0 } }],
    })
  return result
}

export const BookService = {
  addNewBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
  addReview,
}
