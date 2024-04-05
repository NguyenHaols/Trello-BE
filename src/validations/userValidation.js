import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'


const createNew = async(req, res, next) => {

  const correctCondition = Joi.object({
    email: Joi.string().required().min(3).max(50).trim().strict(),
    username: Joi.string().required().min(3).max(50).trim().strict(),
    password: Joi.string().required().min(3).max(50).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }

}


export const userValidation = {
  createNew,
//   update
}