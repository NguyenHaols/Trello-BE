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

export const roleController = {
  createNew
}
