/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { userModel } from '~/models/userModel'
import bcrypt from 'bcrypt'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { workspaceModel } from '~/models/workspaceModel'

const createNew = async (reqbody) => {

  try {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(reqbody.password, salt)
    const newUser = {
      ...reqbody,
      password:hashed,
      slug: slugify(reqbody.username)
    }

    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    return getNewUser
  } catch (error) {
    throw error
  }

}

const getAll = async () => {
  try {
    const users = await userModel.getAll()
    const resUsers = [
      ...users
    ]

    resUsers.forEach(user => {
      delete user.password
    })

    if (!users) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return resUsers
  } catch (error) {
    throw error
  }
}

const findOneById = async (id) => {
  try {
    const user = await userModel.findOneById(id)
    const resUser = {
      ...user
    }
    delete resUser.password

    if (!resUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return resUser
  } catch (error) {
    throw error
  }
}

const findOneByEmail = async (email) => {
  try {
    const user = await userModel.findOneByEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found')
    }
    return user
  } catch (error) {
    throw error
  }
}

const addStarredBoard = async (reqbody) => {
  try {
    const result = await userModel.addStarredBoard(reqbody.userId, reqbody.starredBoardId)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return result
  } catch (error) {
    throw error
  }
}

const removeStarredBoard = async (reqbody) => {
  try {
    const result = await userModel.removeStarredBoard(reqbody.userId, reqbody.starredBoardId)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return result
  } catch (error) {
    throw error
  }
}

const findUserDetailById = async(id) => {
  try {
    const user = await userModel.findOneById(id)
    const userClone = cloneDeep(user)
    delete userClone.password
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Id user not found')
    } else {
      const workspaces = await workspaceModel.getWorkspacesIncludeMemberId(user._id)
      const cloneWorkspaces = cloneDeep(workspaces)
      userClone.workspaces = cloneWorkspaces
    }

    return userClone
  } catch (error) {
    throw error
  }
}

const updateUser = async(reqbody) => {
  try {
    const user = await userModel.updateUser(reqbody)
    const newUser = cloneDeep(user)
    delete newUser.password
    return newUser
  } catch (error) {
    throw error
  }
}

const updatePassword = async(reqbody) => {
  try {
    const user = await checkLogin(reqbody)
    if ( user._id ) {
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(reqbody.newPassword, salt)
      const newPassword = hashed
      const updatedUser = await userModel.updatePassword(reqbody.email, newPassword)
      const cloneUpdatedUser = cloneDeep(updatedUser)
      delete cloneUpdatedUser.password
      return cloneUpdatedUser
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Your password is not valid')
    }
  } catch (error) {
    throw error
  }
}

const checkLogin = async(reqBody) => {
  try {
    const user = await userModel.findOneByEmail(reqBody.email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    const validPassword = await bcrypt.compare(
      reqBody.password,
      user.password
    )

    const resUser = {
      ...user
    }
    delete resUser.password
    return validPassword ? resUser : { succes:false, message:'Wrong password' }
  } catch (error) {
    throw error
  }
}



export const userService = {
  createNew,
  findOneById,
  findOneByEmail,
  checkLogin,
  getAll,
  findUserDetailById,
  updateUser,
  updatePassword,
  addStarredBoard,
  removeStarredBoard
}