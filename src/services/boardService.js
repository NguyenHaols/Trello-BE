/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqbody) => {
  try {
    const newBoard = {
      ...reqbody,
      slug: slugify(reqbody.title)
    }

    const createdBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // console.log(getNewBoard)
    return getNewBoard
  } catch (error) {
    throw error
  }

}

const getDetail = async (boardId) => {
  try {

    const board = await boardModel.getDetail(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    return board
  } catch (error) {
    throw error
  }

}

export const boardService = {
  createNew,
  getDetail
}