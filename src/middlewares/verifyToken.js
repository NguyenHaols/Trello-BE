import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import jwt from 'jsonwebtoken'
import { workspaceService } from '~/services/workspaceService'

export const verifyTokenUser = (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    (req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null)
  if (token) {
    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Token is not valid' })
      }
      req.user = user
      next()
    })
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Your not authenticated' })
  }
}

export const verifyTokenAdmin = (req, res, next) => {
  verifyTokenUser(req, res, () => {
    if (req.user.roleId === '66136281a82158d0e227adcf') {
      next()
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Your not allowed to request' })
    }
  })
}

export const verifyTokenManager = (req, res, next) => {
  verifyTokenUser(req, res, async () => {
    const userId = req.user.id
    const workspaceId = req.body.workspaceId
    const result = await workspaceService.findManagerById(userId, workspaceId)
    if (result === true) {
      next()
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Your not allowed to request' })
    }
  })
}
