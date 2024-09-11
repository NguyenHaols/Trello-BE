import Joi, { object } from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { boardModel } from './boardModel'
import { userModel } from './userModel'
import { userService } from '~/services/userService'
import { workspaceModel } from './workspaceModel'
import { result } from 'lodash'

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
  email: Joi.string().required().min(10).max(50).trim().strict(),
  addedAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await MEMBER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const getMembersByWorkspaceId = async (workspaceId) => {
  try {
    const members = await GET_DB().collection(MEMBER_COLLECTION_NAME).aggregate([
      { $match: { workspaceId: new ObjectId(workspaceId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'email',
          foreignField: 'email',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$$ROOT', '$userDetails']
          }
        }
      },
      {
        $project: {
          userDetails: 0, // Loại bỏ trường userDetails vì nó đã được hợp nhất vào đối tượng gốc
          password: 0 // Loại bỏ password
        }
      }
    ]).toArray()

    return members
  } catch (error) {
    throw new Error(error.message)
  }
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

const deleteMember = async (workspaceId, email) => {
  try {
    const result = await GET_DB()
      .collection(MEMBER_COLLECTION_NAME)
      .deleteOne({
        workspaceId: new ObjectId(workspaceId),
        email: email
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const checkMemberExist = async (workspaceId, email) => {
  try {
    const result = await GET_DB()
      .collection(MEMBER_COLLECTION_NAME)
      .findOne({
        workspaceId: new ObjectId(workspaceId),
        email: email
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

const getWorkspacesByMemberId = async (memberId) => {
  try {
    const result = await GET_DB()
      .collection(MEMBER_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            userId: new ObjectId(memberId)
          }
        },
        {
          $lookup: {
            from: workspaceModel.WORKSPACE_COLLECTION_NAME,
            localField: 'workspaceId',
            foreignField: '_id',
            as: 'workspaces'
          }
        },
        {
          $unwind: '$workspaces'
        },
        {
          $replaceRoot: { newRoot: '$workspaces' }
        },
        {
          $lookup: {
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'workspaceId',
            as: 'boards'
          }
        }
      ])
      .toArray()

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const memberModel = {
  checkMemberExist,
  createNew,
  deleteMember,
  getWorkspacesByMemberId,
  getMembersByWorkspaceId,
  MEMBER_COLLECTION_NAME
}
