import express from 'express'
import { reportController } from '~/controllers/reportController'
import { verifyTokenAdmin, verifyTokenUser } from '~/middlewares/verifyToken'

const Router = express.Router()

Router.route('/getAll').get(verifyTokenAdmin, reportController.getAll)

Router.route('/createNew').post(verifyTokenUser, reportController.createNew)

Router.route('/deleteOne').post(verifyTokenAdmin, reportController.deleteOne)


export const reportRoute = Router

