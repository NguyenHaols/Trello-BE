import { StatusCodes } from 'http-status-codes'
import { memberService } from '~/services/membersService'

const addNew = async (req, res, next) => {
  try {
    const { workspaceId, email } = req.body
    const newMember = await memberService.addMember(workspaceId, email)
    res.status(StatusCodes.OK).json(newMember)
  } catch (error) {
    next(error)
  }
}

const removeMember = async (req, res, next) => {
  try {
    const { workspaceId, email } = req.body
    const newMember = await memberService.removeMember(workspaceId, email)
    res.status(StatusCodes.OK).json(newMember)
  } catch (error) {
    next(error)
  }
}

const getMembersByWorkspaceId = async(req, res, next) => {
  try {
    const workspaceId = req.params.id
    const members = await memberService.getMembersByWorkspaceId(workspaceId)
    res.status(StatusCodes.OK).json(members)
    return members
  } catch (error) {
    next(error)
  }
}

export const memberController = {
  addNew,
  removeMember,
  getMembersByWorkspaceId
}
