/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { userModel } from '~/models/userModel'
import { workspaceModel } from '~/models/workspaceModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatter'

const addMember = async (reqBody) => {
  try {
    const user = await userModel.findOneByEmail(reqBody.email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    const cloneUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar
    }

    const workspace = await workspaceModel.addMember(
      reqBody.workspaceId,
      cloneUser
    )
    if (!workspace) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'workspace not found')
    }
    return workspace
  } catch (error) {
    throw error
  }
}

const removeMember = async (reqbody) => {
  try {
    const result = await workspaceModel.removeMember(
      reqbody.workspaceId,
      reqbody.email
    )
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'workspace not found')
    }
    return result
  } catch (error) {
    throw error
  }
}

const createWorkspace = async (reqbody) => {
  try {
    const newWorkspace = {
      ...reqbody,
      slug: slugify(reqbody.title)
    }
    const createdWorkspace = await workspaceModel.createWorkspace(newWorkspace)
    const getNewWorkspace = await workspaceModel.findOneById(
      createdWorkspace.insertedId
    )
    return getNewWorkspace
  } catch (error) {
    throw error
  }
}

const update = async (reqbody) => {
  try {
    const newData = {
      ...reqbody
    }
    delete newData._id

    const updated = await workspaceModel.update(reqbody._id, newData)
    if (!updated) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workspace not found')
    }
    return updated
  } catch (error) {
    throw error
  }
}

const deleteOneById = async (reqbody) => {
  try {
    const result = await workspaceModel.deleteOneById(reqbody._id)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
    }
    return result
  } catch (error) {
    throw error
  }
}

const getAll = async () => {
  try {
    const result = await workspaceModel.getAll()
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workspace not found')
    }
    return result
  } catch (error) {
    throw error
  }
}

const findManagerById = async (userId, workspaceId) => {
  let isManager = await workspaceModel.findManagerById(userId, workspaceId)
  return isManager
}

export const workspaceService = {
  addMember,
  removeMember,
  createWorkspace,
  update,
  deleteOneById,
  getAll,
  findManagerById
}
