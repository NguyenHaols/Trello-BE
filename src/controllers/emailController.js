import { emailService } from '~/services/emailService'

const { StatusCodes } = require('http-status-codes')

const sendEmail = async (req, res, next) => {
  try {
    const reponse = await emailService.sendEmail(req.body)
    return res.status(StatusCodes.OK).json(reponse)
  } catch (error) {
    next(error)
  }
}


export const emailController = {
  sendEmail
}