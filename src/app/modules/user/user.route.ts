import express from 'express'
import { UserController } from './user.controller'
import requestValidator from '../../middlewares/requestValidator'
import { UserValidation } from './user.validation'
import verifyUserAuth from '../../middlewares/verifyUserAuth'
const router = express.Router()
router.get('/my-profile', verifyUserAuth(), UserController.getMyProfileUser)

router.patch(
  '/my-profile',
  requestValidator(UserValidation.updateProfileZodSchema),
  verifyUserAuth(),
  UserController.updateProfile
)

export const UserRoutes = router
