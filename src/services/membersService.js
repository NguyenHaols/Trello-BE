import { memberModel } from '~/models/memberModel'
import { userService } from './userService'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const addMember = async (workspaceId, email) => {
  try {
    const checkUser = await memberModel.checkMemberExist(workspaceId, email)
    if (checkUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User already exist')
    }
    const user = await userService.findOneByEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User not exist')
    }
    const member = {
      workspaceId,
      email: email,
      userId: user._id.toString(),
    }
    const result = await memberModel.createNew(member)
    return result.acknowledged == true
      ? { message: 'Add member success', user: user }
      : { message: 'Add member is failure' }
  } catch (error) {
    throw new Error(error)
  }
}

const getMembersByWorkspaceId = async(workspaceId) => {
  try {
    const members = await memberModel.getMembersByWorkspaceId(workspaceId)
    if (members.length <= 0 ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Can\'t find any data, check workspace Id'
      )
    }
    return members
  } catch (error) {
    throw new Error(error)
  }
}

const removeMember = async (workspaceId, email) => {
  try {
    const checkUser = await memberModel.checkMemberExist(workspaceId, email)
    if (!checkUser) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'User or workspace is not exist'
      )
    }
    const isDeleted = await memberModel.deleteMember(workspaceId, email)

    return isDeleted.acknowledged == true
      ? { message: 'remove member success',success: true }
      : { message: 'remove member is failure',success: false }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'User or workspace is not exist'
    )
  }
}

export const memberService = {
  addMember,
  removeMember,
  getMembersByWorkspaceId
}
