import express from 'express'
import {StatusCodes} from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController' 


const Router = express.Router()

Router.route('/')
  .get( (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'api get list boards'})
  })

  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getDetail)
  .put(boardValidation.update, boardController.update)

Router.route('/supports/movingCard')
  .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

Router.route('/delete')
  .post(boardController.deleteBoard)
export const boardRoute = Router