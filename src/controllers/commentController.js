import { StatusCodes } from 'http-status-codes'
import { commentModel } from '~/models/commentModel'
import { commentService } from '~/services/commentService'
import { response } from '~/utils/response'

const createNew = async(req, res, next) => {
  try {
    const createdComment = await commentService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdComment)
  } catch (error) {
    next(error)
  }
}

const deleteOneById = async(req, res, next) => {
  try {
    const result = await commentService.deleteById(req.body.commentId)
    if (result) {
      res.status(StatusCodes.OK).json(response(true,'Delete successfully'))
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success:false, message:'Delete failure, this comment may no longer exist' })
    }
  } catch (error) {
    next(error)
  }
}

const updateContentById = async(req, res, next) => {
  try {
    const commentId = req.body.commentId
    const newContent = req.body.newContent
    const result = await commentService.updateContentById(commentId, newContent)
    if (result) {
      res.status(StatusCodes.OK).json(response(true, 'Update successfully',result))
    } else {
      res.status(StatusCodes.BAD_REQUEST).json(response(false,'Update failure, this comment may no longer exist'))
    }
  } catch (error) {
    next(error)
  }
}

const getAll = async(req, res, next) => {
  try {
    const comments = await commentService.getAll()
    res.status(StatusCodes.OK).json(comments)
  } catch (error) {
    next(error)
  }
}

const getGrowthPercentOnMonth = async(req, res, next) => {
  try {
    const result = await commentModel.growthPercentOnMonth()
    return res.status(StatusCodes.OK).json(response(true,'Success',result))
  } catch (error) {
    next()
  }
}

export const commentController = {
  createNew,
  getAll,
  deleteOneById,
  updateContentById,
  getGrowthPercentOnMonth
}