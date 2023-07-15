import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IBook, IBookFilters } from './book.interface'
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

export const BookService = {
  addNewBook,
  getAllBooks,
}
