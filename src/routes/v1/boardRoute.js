import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { verifyTokenUser } from '~/middlewares/verifyToken'


const Router = express.Router()

Router.route('/')
  .get( (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'api get list boards' })
  })

  .post(verifyTokenUser, boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(verifyTokenUser, boardController.getDetail)
  .put(verifyTokenUser, boardValidation.update, boardController.update)

Router.route('/supports/movingCard')
  .put(verifyTokenUser, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

Router.route('/delete')
  .post(verifyTokenUser, boardController.deleteBoard)


export const boardRoute = Router