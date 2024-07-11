import express from 'express'
import { memberController } from '~/controllers/memberController'
import { verifyTokenManager, verifyTokenUser } from '~/middlewares/verifyToken'

const Router = express.Router()

Router.route('/addMember').post(verifyTokenManager, memberController.addNew)

Router.route('/removeMember').post(
  verifyTokenManager,
  memberController.removeMember
)

Router.route('/getMembersByWorkspaceId/:id').get(verifyTokenUser, memberController.getMembersByWorkspaceId)

export const memberRoute = Router
