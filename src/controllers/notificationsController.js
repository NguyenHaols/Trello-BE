import { StatusCodes } from 'http-status-codes'
import { notificationsService } from '~/services/notificationsService'
import { response } from '~/utils/response'

const createNew = async (req, res, next) => {
  try {
    const notification = await notificationsService.createNew(req.body)
    if (notification) {
      return res.status(StatusCodes.CREATED).json(response(true, 'Create new notification success', notification))
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response(false, 'Create new notification failed'))
  } catch (error) {
    next(error)
  }
}

const findByReceiverId = async(req, res, next) => {
  try {
    const notifications = await notificationsService.findByReceiverId(req.body)
    return res.status(StatusCodes.OK).json(response(true, 'Find by receiverId success', notifications))
  } catch (error) {
    next(error)
  }
}

const setIsRead = async(req, res, next) => {
  try {
    const {_id} = req.body
    const result = await notificationsService.setIsRead(_id)
    return result ? res.status(StatusCodes.OK).json(response(true,'Update is read success', result)) : res.status(StatusCodes.BAD_REQUEST).json(response(false,'Update is read failure'))
  } catch (error) {
    next(error)
  }
}

export const notificationsController = {
  createNew,
  findByReceiverId,
  setIsRead
}