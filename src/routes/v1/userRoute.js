import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'
import { verifyTokenUser, verifyTokenAdmin } from '~/middlewares/verifyToken'


const Router = express.Router()

Router.route('/')
  .get(verifyTokenAdmin, userController.getAll)

  .post(userValidation.createNew, userController.createNew)

Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/logout')
  .post(verifyTokenUser, userController.logOut)

Router.route('/refreshToken')
  .post(userController.requestRefreshToken)

Router.route('/getUser')
  .get(userController.getUser)

export const userRoute = Router