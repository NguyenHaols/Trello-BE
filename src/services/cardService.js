/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { userModel } from '~/models/userModel'

const createNew = async (reqbody) => {
  try {
    const newCard = {
      ...reqbody
    }

    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }
    // console.log(getNewCard)
    return getNewCard
  } catch (error) {
    throw error
  }

}

const updateCard = async(reqbody) => {
  try {
    const dataUpdate = {
      ...reqbody
    }
    delete dataUpdate._id
    const result = cardModel.update(reqbody._id, dataUpdate)
    return result
  } catch (error) {
    throw error
  }
}

const getDetail = async (cardId) => {
  try {

    // Lấy dữ liệu từ DB
    const card = await cardModel.getDetail(cardId)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
    }

    // Clone lại từ dữ liệu ban đầu và sửa lại cấu trúc dữ liệu trả ra
    const resCard = cloneDeep(card)
    resCard.cards.forEach(card => {
      card.cards = resCard.cards.filter(card => card.cardId.equals(card._id))
    })
    delete resCard.cards

    return resCard
  } catch (error) {
    throw error
  }

}

const addMember = async(reqBody) => {
  try {
    const user = await userModel.findOneByEmail(reqBody.email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    const cloneUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar
    }

    const card = await cardModel.addMember(reqBody.cardId, cloneUser)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'workspace not found')
    }
    return card
  } catch (error) {
    throw error
  }
}

const removeMember = async(cardId, userId) => {
  try {

    const card = await cardModel.removeMember(cardId, userId)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'workspace not found')
    }
    return (card.acknowledged && card.modifiedCount) > 0 ? true : false
  } catch (error) {
    throw error
  }
}

const deleteCard = async(reqbody) => {
  try {
    const result = await cardModel.deleteOneById(reqbody._id)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
    }
    return result
  } catch (error) {
    throw error
  }
}

const updateTaskAssign = async(reqbody) => {
  try {
    const { cardId, taskId, taskStatus, userId } = reqbody
    const result = await cardModel.updateTaskAssign(cardId, taskId, taskStatus, userId)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Update failure')
    }
    return result
  } catch (error) {
    throw error
  }
}

const updateTaskTime = async(reqbody) => {
  try {
    const { cardId, taskId, deadline } = reqbody
    const result = await cardModel.updateTaskTime(cardId, taskId, deadline)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Update failure')
    }
    return result
  } catch (error) {
    throw error
  }
}

const updateTask = async(reqbody) => {
  try {
    const result = await cardModel.updateTask(reqbody.cardId, reqbody.taskId, reqbody.taskStatus)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Update failure')
    }
    return result
  } catch (error) {
    throw error
  }
}

const addTask= async(reqbody) => {
  try {
    const result = await cardModel.addTask(reqbody.cardId, reqbody.newTask)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Add task failure')
    }
    return result
  } catch (error) {
    throw error
  }
}


const removeTask= async(cardId, taskId) => {
  try {
    const result = await cardModel.removeTaskById(cardId, taskId)
    return result
  } catch (error) {
    throw error
  }
}

const addAttach = async(reqbody) => {
  try {
    const { cardId, filename, publicId, url, fileExtension } = reqbody
    const newAttach = {
      filename,
      publicId,
      url,
      fileExtension,
      addedAt: Date.now()
    }
    const result = await cardModel.addAttachment(cardId, newAttach)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Add attach failure')
    }
    return result
  } catch (error) {
    throw error
  }
}

const removeAttach= async(cardId, attachId) => {
  try {
    const result = await cardModel.removeAttachById(cardId, attachId)
    return result
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  getDetail,
  addMember,
  updateCard,
  deleteCard,
  updateTask,
  addTask,
  removeTask,
  removeMember,
  updateTaskAssign,
  updateTaskTime,
  addAttach,
  removeAttach
}