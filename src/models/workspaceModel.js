import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { boardModel } from './boardModel'


const WORKSPACE_COLLECTION_NAME = 'workspaces'
const WORKSPACE_COLLECTION_SCHEMA = Joi.object({
  _id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  ownerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  avatar:Joi.string().default('').optional(),
  type: Joi.string().valid('public', 'private').required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await WORKSPACE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}

const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(WORKSPACE_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getWorkspacesIncludeMemberId = async(memberId) => {
  const memberIdObject = typeof memberId === 'string' ? new ObjectId(memberId) : memberId
  try {
    const result = await GET_DB().collection(WORKSPACE_COLLECTION_NAME)
      .aggregate([
        {
          $match:{
            'members._id': memberIdObject,
            _destroy : false
          }
        },
        {
          $lookup:{
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: '_id',
            foreignField:'workspaceId',
            as:'boards'
          }
        }
      ]).toArray()

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const workspaceModel = {
  WORKSPACE_COLLECTION_NAME,
  findOneById,
  getWorkspacesIncludeMemberId
}