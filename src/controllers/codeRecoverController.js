import { codeRecoverService } from '../services/codeRecoverPw'

const { StatusCodes } = require('http-status-codes')

const createNew = async (req, res, next) => {
  try {
    const result = await codeRecoverService.createNew(req.body)
    if (!result) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Create code failure' })
    }
    return res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const findOne = async (req, res, next) => {
  try {
    const email = req.body.email
    const code = req.body.code
    const result = await codeRecoverService.findOne(email, code)
    if (!result) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Can not find code or user email' })
    }
    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const codeRecoverController = {
  createNew,
  findOne
}
