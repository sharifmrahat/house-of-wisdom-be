import express from 'express'
import requestValidator from '../../middlewares/requestValidator'
import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'
const router = express.Router()

router.post(
  '/signup',
  requestValidator(AuthValidation.signupUserZodSchema),
  AuthController.signupUser
)

router.post(
  '/login',
  requestValidator(AuthValidation.logInZodSchema),
  AuthController.loginUser
)

router.post(
  '/refresh-token',
  requestValidator(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
)

export const AuthRoutes = router
