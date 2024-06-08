import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'
import { verifyTokenUser, verifyTokenAdmin } from '~/middlewares/verifyToken'
import { roleController } from '~/controllers/roleController'

const Router = express.Router()

Router.route('/getAll').get(verifyTokenAdmin, roleController.getAll)

Router.route('/create').post(roleController.createNew)

export const roleRoute = Router
