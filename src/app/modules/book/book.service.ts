import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IBook } from './book.interface'
import { Book } from './book.model'

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

export const BookService = {
  addNewBook,
}
