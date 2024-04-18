import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import { generateAccessToken, generateRefreshToken } from '~/utils/Token'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import Cookies from 'js-cookie'

const getAll = async(req, res, next) => {
  try {
    const Users = await userService.getAll()
    res.status(StatusCodes.OK).json(Users)
  } catch (error) {
    next(error)
  }
}

const createNew = async(req, res, next) => {
  try {
    const createUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createUser)
  } catch (error) {
    next(error)
  }
}

const findOneByEmail = async(req, res, next) => {
  try {
    const user = await userService.findOneByEmail(req.body.email)

    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const login = async(req, res, next) => {
  try {
    let accessToken = null
    let refreshToken = null
    const user = await userService.checkLogin(req.body)
    if (user._id) {
      accessToken = generateAccessToken(user)
      refreshToken = generateRefreshToken(user)
      res.cookie('refreshToken', refreshToken, {
        httpOnly:true,
        path:'/',
        sameSite:'None'
      })
      res.cookie('accessToken', accessToken, {
        httpOnly:true,
        path:'/',
        sameSite:'None'
      })
    }

    res.status(StatusCodes.OK).json({ user, accessToken })
  } catch (error) {
    next(error)
  }
}

const logOut = async(req, res, next) => {
  res.clearCookie('refreshToken')
  res.status(StatusCodes.OK).json('LogOut successfully')
}

const requestRefreshToken = async(req, res) => {
  const refeshToken = req.cookies.refeshToken
  if (!refeshToken) return res.status(StatusCodes.UNAUTHORIZED).json('your not authenticated')
  jwt.verify(refeshToken, env.JWT_REFESH_KEY, (err, user) => {
    let newAccessToken
    let newRefeshToken
    if (err) {
      console.log(err)
    } else {
      // if dont err , create new token and refesh token
      newAccessToken= generateAccessToken(user)
      newRefeshToken = generateRefreshToken(user)
      res.cookie('refeshToken', newRefeshToken, {
        httpOnly:true,
        secure:false,
        path:'/',
        sameSite:'strict'
      })
    }
    res.status(StatusCodes.OK).json({accessToken: newAccessToken})

  })
}

const getUser = async (req, res, next) => {
  // const token = req.headers.token.split(' ')[1]
  const token = req.cookies.accessToken
  jwt.verify(token, env.JWT_ACCESS_KEY, async(err, decoded) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({error: 'Token is not valid'})
    } else {
      const userdecode = decoded
      const user = await userService.findUserDetailById(userdecode.id)
      if (user) {
        return res.status(StatusCodes.OK).json(user)
      } else {
        return res.status(StatusCodes.OK).json('user is not exist')
      }
    }
  })
}



export const userController= {
  createNew,
  findOneByEmail,
  login,
  logOut,
  getAll,
  requestRefreshToken,
  getUser
}