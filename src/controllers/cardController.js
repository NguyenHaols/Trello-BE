import { StatusCodes } from 'http-status-codes'
import { cardService } from '../services/cardService'
import { response } from '../utils/response'

const createNew = async (req, res, next) => {
  try {
    const createcard = await cardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createcard)
  } catch (error) {
    next(error)
  }
}

const addMember = async (req, res, next) => {
  try {
    const result = await cardService.addMember(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Add member Failure' })
    }
  } catch (error) {
    next(error)
  }
}

const removeMember = async (req, res, next) => {
  try {
    const { cardId, userId } = req.body
    const result = await cardService.removeMember(cardId, userId)
    if (result) {
      return res
        .status(StatusCodes.OK)
        .json(response(true, 'Remove user success'))
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(response(false, 'Remove member Failure'))
    }
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await cardService.updateCard(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Update Failure' })
    }
  } catch (error) {
    next(error)
  }
}

const updateTask = async (req, res, next) => {
  try {
    const result = await cardService.updateTask(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json({ message: 'Update successfully' })
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Update Failure' })
    }
  } catch (error) {
    next(error)
  }
}

const updateTaskAssign = async (req, res, next) => {
  try {
    const result = await cardService.updateTaskAssign(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json({ message: 'Update successfully' })
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Update Failure' })
    }
  } catch (error) {
    next(error)
  }
}

const updateTaskTime = async (req, res, next) => {
  try {
    const result = await cardService.updateTaskTime(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json({ message: 'Update successfully' })
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Update Failure' })
    }
  } catch (error) {
    next(error)
  }
}

const addTask = async (req, res, next) => {
  try {
    const result = await cardService.addTask(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Add task failure' })
    }
  } catch (error) {
    next(error)
  }
}

const addAttach = async (req, res, next) => {
  try {
    const result = await cardService.addAttach(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Add attach failure' })
    }
  } catch (error) {
    next(error)
  }
}

const removeTask = async (req, res, next) => {
  try {
    const cardId = req.body.cardId
    const taskId = req.body.taskId
    const result = await cardService.removeTask(cardId, taskId)
    if (result) {
      return res
        .status(StatusCodes.OK)
        .json(response(true, 'Remove task successfully', result))
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(response(false, 'Remove task failure'))
    }
  } catch (error) {
    next(error)
  }
}

const removeAttach = async (req, res, next) => {
  try {
    const cardId = req.body.cardId
    const attachId = req.body.attachId
    const result = await cardService.removeAttach(cardId, attachId)
    if (result) {
      return res
        .status(StatusCodes.OK)
        .json(response(true, 'Remove attach successfully', result))
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(response(false, 'Remove attach failure'))
    }
  } catch (error) {
    next(error)
  }
}

const deleteCard = async (req, res, next) => {
  try {
    const result = await cardService.deleteCard(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json({ message: 'Delete successfully' })
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Delete Failure' })
    }
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew,
  addMember,
  update,
  deleteCard,
  updateTask,
  addTask,
  removeTask,
  removeMember,
  updateTaskAssign,
  updateTaskTime,
  addAttach,
  removeAttach
}
