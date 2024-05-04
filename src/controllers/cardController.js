import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async(req, res, next) => {
  try {

    const createcard = await cardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createcard)
  } catch (error) {
    next(error)
  }
}

const addMember = async(req, res, next) => {

  try {
    const result = await cardService.addMember(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({message:'Add member Failure'})
    }
  } catch (error) {
    next(error)
  }

}

const update = async(req, res, next) => {
  try {
    const result = await cardService.updateCard(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({message:'Update Failure'})
    }
  } catch (error) {
    next(error)
  }
}

const updateTask = async(req, res, next) => {
  try {
    const result = await cardService.updateTask(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json({message:'Update successfully'})
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({message:'Update Failure'})
    }
  } catch (error) {
    next(error)
  }
}

const addTask = async(req, res, next) => {
  try {
    const result = await cardService.addTask(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({message:'Add task failure'})
    }
  } catch (error) {
    next(error)
  }
}

const deleteCard = async(req, res, next) => {
  try {
    const result = await cardService.deleteCard(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json({message:'Delete successfully'})
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({message:'Delete Failure'})
    }
  } catch (error) {
    next(error)
  }
}

export const cardController= {
  createNew,
  addMember,
  update,
  deleteCard,
  updateTask,
  addTask
}