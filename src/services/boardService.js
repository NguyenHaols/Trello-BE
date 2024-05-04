/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { commentService } from './commentService'

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

    const comments = await commentService.getAll()

    // Clone lại từ dữ liệu ban đầu và sửa lại cấu trúc dữ liệu trả ra
    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
      column.cards.forEach(card => {
        card.comments = comments.filter(
          comment => comment.cardId.toString() === card._id.toString()
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      })
    })
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }

}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    // Lấy dữ liệu từ DB
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }

}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // Cập nhập mảng cardOrderIds của Column ban đầu
    // Cập nhập lại mảng cardOrderIds của Column mới
    // Cập nhập lại ID của card đã kéo thả vào column mới
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResponse:'Success' }
  } catch (error) {
    throw error
  }

}

const deleteBoard = async (reqBody) => {
  try {
    const result = await boardModel.deleteOneById(reqBody.boardId)

    if (result.deletedCount === 0 ) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Delete board failure')
    }

    const board = await boardModel.findOneById(reqBody.boardId)

    if (board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Delete board failure')
    }
    // xoa column
    await columnModel.deleteManyByBoardId(reqBody.boardId)

    // xoa card
    await cardModel.deleteManyByBoardId(reqBody.boardId)


    return { message:'Board deleted succesfully!' }
  } catch (error) {
    throw error
  }

}


export const boardService = {
  createNew,
  getDetail,
  update,
  moveCardToDifferentColumn,
  deleteBoard
}