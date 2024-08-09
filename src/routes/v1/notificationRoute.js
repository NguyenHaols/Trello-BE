import express from 'express'
import { notificationsController } from '~/controllers/notificationsController'

const Router = express.Router()


Router.route('/create')
  .post(notificationsController.createNew)

Router.route('/getNotificationsByReceiver')
  .post(notificationsController.findByReceiverId)

export const notificationsRoute = Router