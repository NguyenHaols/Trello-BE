import { StatusCodes } from 'http-status-codes'
import { commentService } from '~/services/commentService'

const createNew = async(req, res, next) => {
  try {
    const createdComment = await commentService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdComment)
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

export const commentController = {
  createNew,
  getAll
}