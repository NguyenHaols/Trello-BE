/* eslint-disable no-useless-catch */

import { StatusCodes } from 'http-status-codes'
import { commentModel } from '~/models/commentModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqbody) => {
  try {
    const newComment = {
      ...reqbody
    }

    const createdComment = await commentModel.createNew(newComment)
    const getNewCard = await commentModel.findOneById(createdComment.insertedId)

    return getNewCard
  } catch (error) {
    throw error
  }

}

const deleteById = async(id) => {
  try {
    const result = await commentModel.deleteById(id)
    return result.acknowledged && result.deletedCount > 0 ? true : false
  } catch (error) {
    throw error
  }
}

const updateContentById = async(id, newContent) => {
  try {
    const result = await commentModel.updateContentById(id, newContent)
    return result
  } catch (error) {
    throw error
  }
}

const getAll = async () => {
  try {
    const comments = await commentModel.getAll()
    
    if (!comments) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Can not get comments')
    }
    return comments
  } catch (error) {
    throw error
  }
}

export const commentService = {
  createNew,
  getAll,
  deleteById,
  updateContentById
}