import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async(req, res, next) => {

  const correctCondition = Joi.object({
    cardId:  Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    content: Joi.string().required().min(1).max(50).trim().strict(),
    user: Joi.object().required().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }

}

export const commentValidation = {
  createNew
}