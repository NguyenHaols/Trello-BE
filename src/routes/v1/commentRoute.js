import express from 'express'
import { commentController } from '~/controllers/commentController'
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

export const commentRoute = Router