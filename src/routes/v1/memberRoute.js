import express from 'express'
import { memberController } from '~/controllers/memberController'
import { verifyTokenManager } from '~/middlewares/verifyToken'

const Router = express.Router()

Router.route('/addMember').post(verifyTokenManager, memberController.addNew)

Router.route('/removeMember').post(
  verifyTokenManager,
  memberController.removeMember
)

export const memberRoute = Router
