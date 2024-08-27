import express from 'express'
import { workspaceController } from '~/controllers/workspaceController'
import { verifyTokenAdmin, verifyTokenManager, verifyTokenUser } from '~/middlewares/verifyToken'
import { workspaceValidation } from '~/validations/workspaceValidation'

const Router = express.Router()

Router.route('/findById').post(
  verifyTokenUser,
  workspaceController.findOneById
)

Router.route('/addMember').post(
  verifyTokenUser,
  workspaceController.addMember
)

Router.route('/removeMember').post(verifyTokenUser, workspaceController.removeMember)

Router.route('/createWorkspace').post(
  verifyTokenUser,
  workspaceValidation.createNew,
  workspaceController.createWorkspace
)

Router.route('/update').post(
  verifyTokenUser,
  workspaceValidation.update,
  workspaceController.update
)

Router.route('/delete').post(verifyTokenUser, workspaceController.deleteWorkspace)

Router.route('/getAll').get(verifyTokenAdmin, workspaceController.getAll)

export const workspaceRoute = Router
