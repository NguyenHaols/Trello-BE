const { StatusCodes } = require('http-status-codes')
const Joi = require('joi')
const { GET_DB } = require('~/config/mongodb')
const { default: ApiError } = require('~/utils/ApiError')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('~/utils/validators')

const ROLE_COLLECTION_NAME = 'roles'
const ROLE_COLLECTION_SCHEMA = Joi.object({
  roleName: Joi.string().required().min(3).max(50).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await ROLE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    const createdRole = await GET_DB()
      .collection(ROLE_COLLECTION_NAME)
      .insertOne(validData)
    return createdRole
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async () => {
  try {
    const result = await GET_DB()
      .collection(ROLE_COLLECTION_NAME)
      .find({})
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const roleModel = {
  ROLE_COLLECTION_NAME,
  ROLE_COLLECTION_SCHEMA,
  createNew,
  getAll
}
