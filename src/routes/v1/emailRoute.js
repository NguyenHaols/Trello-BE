import express from 'express'
import { emailController } from '~/controllers/emailController'


const Router = express.Router()

Router.route('/sendEmail')
  .post(emailController.sendEmail)

export const emailRoute = Router