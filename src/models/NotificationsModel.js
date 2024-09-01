import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const NOTIFICATIONS_COLLECTION_NAME = 'notifications'
const NOTIFICATIONS_COLLECTION_SCHEMA = Joi.object({
  senderId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  receiverId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  workspaceId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  content: Joi.string().required().min(3).max(250).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  isRead: Joi.boolean().default(false),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await NOTIFICATIONS_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNotifications = async (data) => {
  try {
    const validDate = await validateBeforeCreate(data)
    const newNotification = {
      ...validDate,
      senderId: new ObjectId(validDate.senderId),
      receiverId: new ObjectId(validDate.receiverId),
      workspaceId: new ObjectId(validDate.workspaceId),
    }
    const createdWorkspace = await GET_DB()
      .collection(NOTIFICATIONS_COLLECTION_NAME)
      .insertOne(newNotification)
    return createdWorkspace
  } catch (error) {
    throw new Error(error)
  }
}

const findByReceiverId = async (id) => {
  try {
    const result = await GET_DB()
      .collection(NOTIFICATIONS_COLLECTION_NAME)
      .aggregate([
        {$match: {receiverId: new ObjectId(id)}},
        {
          $lookup: {
            from: 'users',
            localField: 'senderId',
            foreignField: '_id',
            as: 'senderInfo'
          }
        },
        {
          $unwind: '$senderInfo'
        },
        {
          $project: {
            _id: 1,
            senderId: 1,
            receiverId: 1,
            workspaceId: 1,
            content: 1,
            createdAt: 1,
            isRead: 1,
            'senderInfo.username': 1,
            'senderInfo.email': 1,
            'senderInfo.avatar': 1
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(NOTIFICATIONS_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const setIsRead = async(notiId) => {
  try {
    const result = await GET_DB().collection(NOTIFICATIONS_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(notiId)
      },
      {
        $set: {isRead: true}
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


export const notificationsModel = {
  createNotifications,
  findByReceiverId,
  findOneById,
  setIsRead
}