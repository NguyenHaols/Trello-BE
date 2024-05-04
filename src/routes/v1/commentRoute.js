import express from 'express'
import { commentController } from '~/controllers/commentController'
import { commentValidation } from '~/validations/commentValidation'


const Router = express.Router()

Router.route('/getComments')

  .get( commentController.getAll)


Router.route('/postComment')

  .post(commentValidation.createNew, commentController.createNew)

export const commentRoute = Router