/* eslint-disable no-useless-catch */
const { StatusCodes } = require('http-status-codes')
const { codeRecoverModel } = require('~/models/codeRecoverPw')
const { default: ApiError } = require('~/utils/ApiError')

const findOne = async(email, code) => {
  try {
    const result =  await codeRecoverModel.findOne(email, code)
    console.log('🚀 ~ findOne ~ result:', result)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Code is not valid')
    }
    return result
  } catch (error) {
    throw error
  }
}

const createNew = async(reqBody) => {
  try {
    const result = await codeRecoverModel.createNew(reqBody)
    const code = codeRecoverModel.findOneById(result.insertedId)
    if (!code) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Create code failure')
    }
    return code
  } catch (error) {
    throw error
  }
}

export const codeRecoverService = {
  findOne,
  createNew
}