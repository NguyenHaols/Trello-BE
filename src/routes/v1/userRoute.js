import express from 'express'
import {StatusCodes} from 'http-status-codes'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'



const Router = express.Router()

Router.route('/')
  .get( (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'api get list user'})
  })

  .post(userValidation.createNew, userController.createNew)


export const userRoute = Router