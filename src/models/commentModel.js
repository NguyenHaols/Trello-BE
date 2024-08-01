import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const COMMENT_COLLECTION_NAME = 'comments'
const COMMENT_COLLECTION_SCHEMA = Joi.object({
  cardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  user: Joi.object().unknown(true).default({}),
  content: Joi.string().required().max(50).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await COMMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdComment = await GET_DB().collection(COMMENT_COLLECTION_NAME).insertOne(validData)
    return createdComment
  } catch (error) {
    throw new Error(error)
  }
}

const deleteById = async(id) => {
  try {
    const result = await GET_DB().collection(COMMENT_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateContentById = async(id, newContent) => {
  try {
    const result = await GET_DB().collection(COMMENT_COLLECTION_NAME).findOneAndUpdate
    (
      {
        _id: new ObjectId(id)
      },
      {
        $set: { content: newContent, updatedAt: Date.now() }
      },
      {
        returnDocument : 'after'
      }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(COMMENT_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async() => {
  try {
    const result = await GET_DB().collection(COMMENT_COLLECTION_NAME).find({}).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const commentModel = {
  createNew,
  findOneById,
  getAll,
  deleteById,
  updateContentById,
  COMMENT_COLLECTION_NAME
}