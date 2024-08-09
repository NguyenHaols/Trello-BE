/* eslint-disable no-useless-catch */
import { notificationsModel } from '~/models/NotificationsModel'

const createNew = async (reqbody) => {
  const { senderId, receiverId, content, workspaceId } = reqbody
  const data = {
    senderId,
    receiverId,
    content,
    workspaceId
  }
  try {
    const result = await notificationsModel.createNotifications(data)
    const newNotification = await notificationsModel.findOneById(result.insertedId)
    return newNotification
  } catch (error) {
    throw error
  }
}

const findByReceiverId = async(reqbody) => {
  const { receiverId } = reqbody
  try {
    const notifications = await notificationsModel.findByReceiverId(receiverId)
    return notifications
  } catch (error) {
    throw error
  }
}

export const notificationsService = {
  createNew,
  findByReceiverId
}