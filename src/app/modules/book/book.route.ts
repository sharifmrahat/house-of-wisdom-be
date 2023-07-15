import express from 'express'
import requestValidator from '../../middlewares/requestValidator'
import { BookValidation } from './book.validation'
import verifyUserAuth from '../../middlewares/verifyUserAuth'
import { BookController } from './book.controller'
const router = express.Router()

router.post(
  '/add',
  requestValidator(BookValidation.addNewBookZodSchema),
  verifyUserAuth(),
  BookController.addNewBook
)

export const BookRoutes = router
