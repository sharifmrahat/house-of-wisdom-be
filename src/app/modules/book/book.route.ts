import express from 'express'
import requestValidator from '../../middlewares/requestValidator'
import { BookValidation } from './book.validation'
import verifyUserAuth from '../../middlewares/verifyUserAuth'
import { BookController } from './book.controller'
import verifyBookOwner from '../../middlewares/verifyBookOwner'
const router = express.Router()

router.post(
  '/',
  requestValidator(BookValidation.addNewBookZodSchema),
  verifyUserAuth(),
  BookController.addNewBook
)

router.get('/:id', BookController.getSingleBook)

router.get('/', BookController.getAllBooks)

router.patch(
  '/:id',
  requestValidator(BookValidation.updateBookZodSchema),
  verifyBookOwner(),
  BookController.updateBook
)

router.patch(
  '/review/:id',
  requestValidator(BookValidation.addReviewZodSchema),
  verifyUserAuth(),
  BookController.addReview
)

router.delete('/:id', verifyBookOwner(), BookController.deleteBook)

export const BookRoutes = router
