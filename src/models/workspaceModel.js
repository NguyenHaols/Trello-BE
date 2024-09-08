import Joi, { object } from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { boardModel } from './boardModel'
import { userModel } from './userModel'
import { memberModel } from './memberModel'
import moment from 'moment'

const WORKSPACE_COLLECTION_NAME = 'workspaces'
const WORKSPACE_COLLECTION_SCHEMA = Joi.object({
  ownerId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  avatar: Joi.string().default('').optional(),
  type: Joi.string().valid('Public', 'Private').required(),
  // members: Joi.array().items(Joi.object().unknown(true).default).default([]),
  managers: Joi.array().items(Joi.object().unknown(true).default).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await WORKSPACE_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createWorkspace = async (data) => {
  try {
    const user = await userModel.findOneById(data.ownerId)
    const validDate = await validateBeforeCreate(data)
    const newWorkspaceToAdd = {
      ...validDate,
      ownerId: new ObjectId(validDate.ownerId),
      managers: [
        {
          _id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar
        }
      ]
    }
    const createdWorkspace = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .insertOne(newWorkspaceToAdd)
    return createdWorkspace
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, newData) => {
  try {
    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id)
        },
        {
          $set: newData
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(id)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findUserInWorkspace = async (workspaceId, userEmail) => {
  try {
    const workspace = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(workspaceId)
      })
    if (workspace) {
      const user = workspace.members.find(
        (member) => member.email === userEmail
      )
      return user // Trả về user nếu được tìm thấy trong mảng members
    } else {
      return null // Trả về null nếu không tìm thấy workspace
    }
  } catch (error) {
    throw new Error(error)
  }
}

const getWorkspacesIncludeMemberId = async (memberId) => {
  const memberIdObject =
    typeof memberId === 'string' ? new ObjectId(memberId) : memberId
  try {
    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            'members._id': memberIdObject,
            _destroy: false
          }
        },
        {
          $lookup: {
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'workspaceId',
            as: 'boards'
          }
        },
        {
          $lookup: {
            from: memberModel.MEMBER_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'workspaceId',
            as: 'members'
          }
        }
      ])
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addMember = async (workspaceId, user) => {
  try {
    const checkUser = await findUserInWorkspace(workspaceId, user.email)
    if (checkUser) {
      throw new Error('User already exist')
    }
    const workspace = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(workspaceId)
        },
        {
          $push: {
            members: user
          }
        },
        { returnDocument: 'after' }
      )

    return workspace
  } catch (error) {
    throw new Error(error)
  }
}

const removeMember = async (workspaceId, email) => {
  try {
    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(workspaceId)
        },
        {
          $pull: {
            members: { email: email }
          }
        },
        {
          returnDocument: 'after'
        }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async () => {
  try {
    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .find({})
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findManagerById = async (userId, workspaceId) => {
  try {
    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(workspaceId)
      })
    const isIncludeManager =
      result.managers ??
      [].find((id) => {
        if (id.toString() === userId) {
          return true
        } else return false
      })
    return isIncludeManager ? true : false
  } catch (error) {
    throw new Error(error)
  }
}

const growthPercentOnMonth = async() => {
  try {
    const now = moment()
    const startThisMonth = now.clone().startOf('month').valueOf()
    const startLastMonth = now.clone().subtract(1, 'month').startOf('month').valueOf()
    const endLastMonth = now.clone().subtract(1, 'month').endOf('month').valueOf()

    const workspaceThisMonth = await GET_DB().collection(WORKSPACE_COLLECTION_NAME).countDocuments({
      createdAt: { $gte: startThisMonth }
    })

    const workspaceLastMonth = await GET_DB().collection(WORKSPACE_COLLECTION_NAME).countDocuments({
      createdAt: { $gte: startLastMonth, $lte: endLastMonth }
    })

    let percentageDifference = 0
    if (workspaceLastMonth > 0) {
      percentageDifference = ((workspaceThisMonth - workspaceLastMonth) / workspaceLastMonth) * 100
    } else if (workspaceThisMonth > 0) {
      percentageDifference = 100 // Nếu không có user trong tháng trước và có user trong tháng này
    }
    const result = {
      lastMonth: workspaceLastMonth,
      thisMonth: workspaceThisMonth,
      percentageDifference: Number(percentageDifference.toFixed(2))
    }
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const countWorkspaceOnMonth = async () => {
  try {
    const now = moment()
    // Khởi tạo mảng 12 tháng với giá trị count ban đầu là 0
    const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }))

    // Lặp qua từng tháng trong năm
    for (let i = 0; i < 12; i++) {
      const startOfMonth = now.clone().month(i).startOf('month').valueOf() // Thời điểm bắt đầu của tháng i
      const endOfMonth = now.clone().month(i).endOf('month').valueOf() // Thời điểm kết thúc của tháng i

      // Đếm số lượng workspace được tạo trong khoảng thời gian của tháng i
      const workspaceCount = await GET_DB()
        .collection(WORKSPACE_COLLECTION_NAME)
        .countDocuments({
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        })

      // Gán số lượng workspace cho tháng tương ứng
      months[i].count = workspaceCount
    }

    return months
  } catch (error) {
    throw new Error(error)
  }
}

export const workspaceModel = {
  WORKSPACE_COLLECTION_NAME,
  findOneById,
  getWorkspacesIncludeMemberId,
  addMember,
  removeMember,
  createWorkspace,
  update,
  deleteOneById,
  getAll,
  findManagerById,
  growthPercentOnMonth,
  countWorkspaceOnMonth
}
