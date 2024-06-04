import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import jwt from 'jsonwebtoken'

export const verifyTokenUser = (req, res, next) => {
  const token = req.cookies.accessToken
  // console.log('🚀 ~ verifyTokenUser ~ token:', token)
  if (token) {
    jwt.verify(token, env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Token is not valid' })
      }
      req.user = user
      next()
    })
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Your not authenticated' })
  }
}

export const verifyTokenAdmin = (req, res, next) => {
  verifyTokenUser(req, res, () => {
    if (req.user.roleId === '66136281a82158d0e227adcf') {
      next()
    } else {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Your not allowed to request' })
    }
  })
}
