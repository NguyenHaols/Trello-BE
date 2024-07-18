import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import jwt from 'jsonwebtoken'
import { forEach } from 'lodash'
import { workspaceController } from '~/controllers/workspaceController'
import { workspaceService } from '~/services/workspaceService'

export const verifyTokenUser = (req, res, next) => {
  const token = req.cookies.accessToken
  console.log(req.cookies)
  if (token) {
    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
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

export const verifyTokenManager = (req, res, next) => {
  verifyTokenUser(req, res, async () => {
    const userId = req.user.id
    const workspaceId = req.body.workspaceId
    const result = await workspaceService.findManagerById(userId, workspaceId)
    if (result === true) {
      next()
    } else {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Your not allowed to request' })
    }
  })
}
