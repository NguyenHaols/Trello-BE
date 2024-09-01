import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { verifyTokenManager, verifyTokenUser } from '~/middlewares/verifyToken'


const Router = express.Router()

Router.route('/')
  .get( (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'api get list card' })
  })

  .post(cardValidation.createNew, cardController.createNew)

Router.route('/addMember')
  .post(verifyTokenUser, cardController.addMember)

Router.route('/removeMember')
  .post(verifyTokenUser, cardController.removeMember)

Router.route('/update')
  .post(verifyTokenUser, cardController.update)

Router.route('/delete')
  .post(verifyTokenUser, cardController.deleteCard)

Router.route('/updateTask')
  .post(verifyTokenUser, cardController.updateTask)

Router.route('/updateTaskAssign')
  .post(verifyTokenUser, cardController.updateTaskAssign)

Router.route('/updateTaskTime')
  .post(verifyTokenUser, cardController.updateTaskTime)

Router.route('/addTask')
  .post(verifyTokenUser, cardController.addTask)

Router.route('/removeTask')
  .post(verifyTokenUser, cardController.removeTask)

Router.route('/addAttach')
  .post(verifyTokenUser, cardController.addAttach)

Router.route('/removeAttach')
  .post(verifyTokenUser, cardController.removeAttach)


export const cardRoute = Router