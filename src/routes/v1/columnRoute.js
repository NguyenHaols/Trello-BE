import express from 'express'
import {StatusCodes} from 'http-status-codes'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController' 


const Router = express.Router()

Router.route('/')
  .get( (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'api get list column'})
  })

  .post(columnValidation.createNew, columnController.createNew)


  
export const columnRoute = Router