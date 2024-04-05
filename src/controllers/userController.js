import { StatusCodes } from 'http-status-codes'
import { userdService } from '~/services/userService'

const createNew = async(req, res, next) => {
  try {

    const createUser = await userdService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createUser)
  } catch (error) {
    next(error)
  }
}


export const userController= {
  createNew

}