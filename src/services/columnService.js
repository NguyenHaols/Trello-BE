/* eslint-disable no-useless-catch */
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'

const createNew = async (reqbody) => {
  try {
    const newColumn = {
      ...reqbody,
    }

    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      // Cấu trúc api cần có 1 mảng card
      getNewColumn.cards = []

      // Cập nhật mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) {
    throw error
  }

}

const getDetail = async (columnId) => {
  try {

    // Lấy dữ liệu từ DB
    const column = await columnModel.getDetail(columnId)
    if (!column) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }

    // Clone lại từ dữ liệu ban đầu và sửa lại cấu trúc dữ liệu trả ra
    const resColumn = cloneDeep(column)
    resColumn.columns.forEach(column => {
      column.cards = resColumn.cards.filter(card => card.columnId.equals(column._id))
    })
    delete resColumn.cards

    return resColumn
  } catch (error) {
    throw error
  }

}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    // Lấy dữ liệu từ DB
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) {
    throw error
  }

}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }
    // xoa column
    await columnModel.deleteOneById(columnId)

    // xoa card
    await cardModel.deleteManyByColumnId(columnId)

    // xoa columnId trong board 
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult:'Column and its cards deleted succesfully!' }
  } catch (error) {
    throw error
  }

}

export const columnService = {
  createNew,
  getDetail,
  update,
  deleteItem
}