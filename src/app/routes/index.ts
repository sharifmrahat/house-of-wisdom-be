import express from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/auth/auth.route'
import { BookRoutes } from '../modules/book/book.route'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/book',
    route: BookRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
