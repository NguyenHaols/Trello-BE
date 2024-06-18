import { memberModel } from '~/models/memberModel'
import { userService } from './userService'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const addMember = async (workspaceId, userId) => {
  try {
    const checkUser = await memberModel.checkMemberExist(workspaceId, userId)
    if (checkUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exist')
    }
    const user = await userService.findOneById(userId)
    const member = {
      workspaceId,
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      avatar: user.avatar
    }
    const result = await memberModel.createNew(member)
    return result.acknowledged == true
      ? { message: 'Add member success' }
      : { message: 'Add member is failure' }
  } catch (error) {
    throw new Error(error)
  }
}

const removeMember = async (workspaceId, userId) => {
  try {
    const checkUser = await memberModel.checkMemberExist(workspaceId, userId)
    if (!checkUser) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'User or workspace is not exist'
      )
    }
    const isDeleted = await memberModel.deleteMember(workspaceId, userId)

    return isDeleted.acknowledged == true
      ? { message: 'remove member success' }
      : { message: 'remove member is failure' }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'User or workspace is not exist'
    )
  }
}

export const memberService = {
  addMember,
  removeMember
}
