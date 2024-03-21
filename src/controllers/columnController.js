import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async(req, res, next) => {
  try {

    const createcolumn = await columnService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createcolumn)
  } catch (error) {
    next(error)
  }
}

const update = async(req, res, next) => {
  try {

    const columnId = req.params.id
    const updatedColumn = await columnService.update(columnId, req.body)

    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) {
    next(error)
  }
}

const deleteItem = async(req, res, next) => {
  try {
    const columnId = req.params.id
    console.log('🚀 ~ deleteItem ~ columnId:', columnId)
    const result = await columnService.deleteItem(columnId)
    console.log('🚀 ~ deleteItem ~ result:', result)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const columnController= {
  createNew,
  update,
  deleteItem
}