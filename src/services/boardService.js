/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

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

    // Lấy dữ liệu từ DB
    const board = await boardModel.getDetail(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // Clone lại từ dữ liệu ban đầu và sửa lại cấu trúc dữ liệu trả ra
    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }

}

export const boardService = {
  createNew,
  getDetail
}