import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import * as dotenv from 'dotenv'

dotenv.config()

export const generateAccessToken = (user, body) => {
  return jwt.sign(
    {
      id: user._id,
      roleId: user.roleId,
      body: body
    },
    env.JWT_ACCESS_KEY,
    { expiresIn: '7d' }
  )
}

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      roleId: user.roleId
    },
    env.JWT_REFESH_KEY,
    { expiresIn: '365d' }
  )
}
