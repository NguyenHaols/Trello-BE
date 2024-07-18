import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import { generateAccessToken, generateRefreshToken } from '~/utils/Token'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

const getAll = async (req, res, next) => {
  try {
    const Users = await userService.getAll()
    res.status(StatusCodes.OK).json(Users)
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const createUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createUser)
  } catch (error) {
    next(error)
  }
}

const findOneByEmail = async (req, res, next) => {
  try {
    const user = await userService.findOneByEmail(req.body.email)

    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    let accessToken = null
    let refreshToken = null
    const user = await userService.checkLogin(req.body)
    if (user._id) {
      accessToken = generateAccessToken(user, req.body)
      refreshToken = generateRefreshToken(user)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        secure: false,
        sameSite: 'None'
      })
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        path: '/',
        secure: false,
        sameSite: 'None'
      })
    }

    res.status(StatusCodes.OK).json({ user, accessToken })
  } catch (error) {
    next(error)
  }
}

const logOut = async (req, res, next) => {
  res.clearCookie('refreshToken')
  res.status(StatusCodes.OK).json('LogOut successfully')
}

const requestRefreshToken = async (req, res) => {
  const refeshToken = req.cookies.refeshToken
  if (!refeshToken)
    return res.status(StatusCodes.UNAUTHORIZED).json('your not authenticated')
  jwt.verify(refeshToken, env.JWT_REFESH_KEY, (err, user) => {
    let newAccessToken
    let newRefeshToken
    if (err) {
      console.log(err)
    } else {
      // if dont err , create new token and refesh token
      newAccessToken = generateAccessToken(user)
      newRefeshToken = generateRefreshToken(user)
      res.cookie('refeshToken', newRefeshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })
    }
    res.status(StatusCodes.OK).json({ accessToken: newAccessToken })
  })
}

const getUser = async (req, res, next) => {
  try {
    const user = await userService.findUserDetailById(req.user.id)
    if (user) {
      return res.status(StatusCodes.OK).json(user)
    }
  } catch (error) {
    next()
  }
}

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.body)
    if (user) {
      return res.status(StatusCodes.OK).json(user)
    } else {
      return res.status(StatusCodes.NOT_FOUND).json('Update Failed')
    }
  } catch (error) {
    next(error)
  }
}

const addStarredBoard = async (req, res, next) => {
  try {
    const result = await userService.addStarredBoard(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res.status(StatusCodes.NOT_FOUND).json('Add starred board failure')
    }
  } catch (error) {
    next(error)
  }
}

const removeStarredBoard = async (req, res, next) => {
  try {
    const result = await userService.removeStarredBoard(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json('Remove starred board failure')
    }
  } catch (error) {
    next(error)
  }
}

const updatePassword = async (req, res, next) => {
  try {
    const user = await userService.updatePassword(req.body)
    if (user) {
      return res.status(StatusCodes.OK).json(user)
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Update Failed' })
    }
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  findOneByEmail,
  login,
  logOut,
  getAll,
  requestRefreshToken,
  getUser,
  updateUser,
  updatePassword,
  addStarredBoard,
  removeStarredBoard
}
