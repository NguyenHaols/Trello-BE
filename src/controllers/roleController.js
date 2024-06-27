import { StatusCodes } from 'http-status-codes'
import { roleService } from '~/services/roleService'

const createNew = async (req, res, next) => {
  try {
    const createdRole = await roleService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdRole)
  } catch (error) {
    next()
  }
}

const getAll = async (req, res, next) => {
  try {
    const roles = await roleService.getAll()
    res.status(StatusCodes.OK).json(roles)
  } catch (error) {
    next(error)
  }
}

export const roleController = {
  createNew,
  getAll
}
