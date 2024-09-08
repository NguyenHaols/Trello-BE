import express from 'express'
import { commentController } from '~/controllers/commentController'
import { verifyTokenAdmin } from '~/middlewares/verifyToken'
import { commentValidation } from '~/validations/commentValidation'


const Router = express.Router()

Router.route('/getComments')
  .get(commentController.getAll)

Router.route('/deleteComment')
  .post(commentController.deleteOneById)

Router.route('/postComment')
  .post(commentValidation.createNew, commentController.createNew)

Router.route('/updateContent')
  .post(commentController.updateContentById)

Router.route('/getPercentOnMonth').get(verifyTokenAdmin, commentController.getGrowthPercentOnMonth)


export const commentRoute = Router