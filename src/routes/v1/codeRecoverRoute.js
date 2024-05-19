import express from 'express'
import {StatusCodes} from 'http-status-codes'
import { codeRecoverController } from '~/controllers/codeRecoverController'


const Router = express.Router()

Router.route('/getOne')
  .post(codeRecoverController.findOne)

Router.route('/create')
  .post(codeRecoverController.createNew)


export const codeRecoverRoute = Router