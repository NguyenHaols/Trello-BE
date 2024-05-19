import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import ApiError from '~/utils/ApiError'


const CODE_RECOVER_COLLECTION_NAME = 'code_recover'
const CODE_RECOVER_COLLECTION_SCHEMA = Joi.object({
  code: Joi.string().required().min(3).max(50).trim().strict(),
  email: Joi.string().required().min(3).max(50).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})


const validateBeforeCreate = async (data) => {
  return await CODE_RECOVER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdCode = await GET_DB().collection(CODE_RECOVER_COLLECTION_NAME).insertOne(validData)
    return createdCode
  } catch (error) {
    throw new Error(error)
  }
}


const findOne= async(email, code) => {
  try {
    const result = await GET_DB().collection(CODE_RECOVER_COLLECTION_NAME).findOne({
      email: email,
      code: code
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(CODE_RECOVER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const codeRecoverModel = {
  createNew,
  findOne,
  findOneById
}