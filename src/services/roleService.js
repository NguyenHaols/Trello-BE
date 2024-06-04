/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { roleModel } from '~/models/roleModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    const result = await roleModel.createNew(reqBody)
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Create failure')
    }
    return result
  } catch (error) {
    throw error
  }
}

export const roleService = {
  createNew
}
