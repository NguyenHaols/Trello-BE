import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'


const Router = express.Router()

Router.route('/')
  .get( (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'api get list card' })
  })

  .post(cardValidation.createNew, cardController.createNew)

Router.route('/addMember')
  .post(cardController.addMember)

  Router.route('/removeMember')
  .post(cardController.removeMember)

Router.route('/update')
  .post(cardController.update)

Router.route('/delete')
  .post(cardController.deleteCard)

Router.route('/updateTask')
  .post(cardController.updateTask)

  Router.route('/updateTaskAssign')
  .post(cardController.updateTaskAssign)

Router.route('/addTask')
  .post(cardController.addTask)

  Router.route('/removeTask')
  .post(cardController.removeTask)


export const cardRoute = Router