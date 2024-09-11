import { StatusCodes } from 'http-status-codes'
import { reportService } from '~/services/reportService'
import { response } from '~/utils/response'

const createNew = async(req, res, next) => {
  try {
    const report = await reportService.createNew(req.body)
    return report ? res.status(StatusCodes.CREATED).json(response(true, 'Created', report)) : res.status(StatusCodes.BAD_REQUEST).json(response(false, 'Create failed'))
  } catch (error) {
    next(error)
  }
}

const getAll = async(req, res, next) => {
  try {
    const reports = await reportService.getAll()
    return reports ? res.status(StatusCodes.OK).json(response(true, 'Get all success', reports)) : res.status(StatusCodes.BAD_REQUEST).json(response(false, 'Get all failed'))
  } catch (error) {
    next(error)
  }
}

const deleteOne = async(req, res, next) => {
  try {
    const result = await reportService.deleteOne(req.body)
    return result ? res.status(StatusCodes.OK).json(response(true, 'Get all success', result)) : res.status(StatusCodes.BAD_REQUEST).json(response(false, 'Get all failed'))
  } catch (error) {
    next(error)
  }
}

export const reportController = {
  createNew,
  getAll,
  deleteOne
}