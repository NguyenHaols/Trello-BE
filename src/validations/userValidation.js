import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'


const createNew = async(req, res, next) => {

  const correctCondition = Joi.object({
    email: Joi.string().required().min(10).max(50).trim().strict(),
    username: Joi.string().required().min(3).max(50).trim().strict(),
    password: Joi.string().required().min(5).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }

}

const login = async(req, res, next) => {

  const correctCondition = Joi.object({
    email: Joi.string().required().min(10).max(50).trim().strict(),
    password: Joi.string().required().min(5).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async(req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().min(10).max(50).trim().strict(),
    username: Joi.string().required().min(3).max(50).trim().strict(),
    avatar: Joi.string().min(3).trim().strict(),
  }).unknown(true)

  try {
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updatePassword = async(req, res, next) => {
  const correctCondition = Joi.object({
    password: Joi.string().min(6).max(50).trim().strict(),
    newPassword: Joi.string().min(6).max(50).trim().strict(),
  }).unknown(true)

  try {
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}


export const userValidation = {
  createNew,
  login,
  update,
  updatePassword
}