import Joi, { object } from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { boardModel } from './boardModel'
import { userModel } from './userModel'
import { userService } from '~/services/userService'

const MEMBER_COLLECTION_NAME = 'members'
const MEMBER_COLLECTION_SCHEMA = Joi.object({
  workspaceId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  username: Joi.string().required().min(3).max(50).trim().strict(),
  email: Joi.string().required().min(10).max(50).trim().strict(),
  avatar: Joi.string().default('').optional(),
  addedAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await MEMBER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    const validate = await validateBeforeCreate(data)
    const newMemberToAdd = {
      ...validate,
      workspaceId: new ObjectId(validate.workspaceId),
      userId: new ObjectId(validate.userId)
    }
    const createNew = await GET_DB()
      .collection(MEMBER_COLLECTION_NAME)
      .insertOne(newMemberToAdd)
    return createNew
  } catch (error) {
    throw new Error(error)
  }
}

const deleteMember = async (workspaceId, userId) => {
  try {
    const result = await GET_DB()
      .collection(MEMBER_COLLECTION_NAME)
      .deleteOne({
        workspaceId: new ObjectId(workspaceId),
        userId: new ObjectId(userId)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const checkMemberExist = async (workspaceId, userId) => {
  try {
    const result = await GET_DB()
      .collection(MEMBER_COLLECTION_NAME)
      .findOne({
        workspaceId: new ObjectId(workspaceId),
        userId: new ObjectId(userId)
      })
    if (result) {
      return true
    } else {
      return false
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const memberModel = {
  checkMemberExist,
  createNew,
  deleteMember
}
