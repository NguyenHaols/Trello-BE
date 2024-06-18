import { StatusCodes } from 'http-status-codes'
import { memberService } from '~/services/membersService'

const addNew = async (req, res, next) => {
  try {
    const { workspaceId, userId } = req.body
    const newMember = await memberService.addMember(workspaceId, userId)
    res.status(StatusCodes.OK).json(newMember)
  } catch (error) {
    next(error)
  }
}

const removeMember = async (req, res, next) => {
  try {
    const { workspaceId, userId } = req.body
    const newMember = await memberService.removeMember(workspaceId, userId)
    res.status(StatusCodes.OK).json(newMember)
  } catch (error) {
    next(error)
  }
}

export const memberController = {
  addNew,
  removeMember
}
