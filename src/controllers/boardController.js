import { StatusCodes } from 'http-status-codes'


const createNew = async(req, res, next) => {
  try {
    // console.log(req.body)
    res.status(StatusCodes.CREATED).json({ message: 'post from controller board'})

  } catch (error) {
    next(error)
  }
}

export const boardController= {
  createNew
}