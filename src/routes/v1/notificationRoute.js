import express from 'express'
import { notificationsController } from '~/controllers/notificationsController'
import { verifyTokenUser } from '~/middlewares/verifyToken'

const Router = express.Router()


Router.route('/create')
  .post(verifyTokenUser, notificationsController.createNew)

Router.route('/getNotificationsByReceiver')
  .post(verifyTokenUser, notificationsController.findByReceiverId)

Router.route('/getNotificationsByReceiver')
  .post(verifyTokenUser, notificationsController.findByReceiverId)

Router.route('/setIsRead')
  .post(verifyTokenUser, notificationsController.setIsRead)

export const notificationsRoute = Router