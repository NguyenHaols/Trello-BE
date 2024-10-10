import express from 'express'
import { reportController } from '~/controllers/reportController'
import { verifyTokenAdmin, verifyTokenUser } from '~/middlewares/verifyToken'

const Router = express.Router()

Router.route('/getAll').get( reportController.getAll)

Router.route('/createNew').post( reportController.createNew)

Router.route('/deleteOne').post( reportController.deleteOne)


export const reportRoute = Router

