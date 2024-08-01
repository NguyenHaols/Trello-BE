import express from 'express'
import { workspaceController } from '~/controllers/workspaceController'
import { verifyTokenAdmin, verifyTokenManager, verifyTokenUser } from '~/middlewares/verifyToken'
import { workspaceValidation } from '~/validations/workspaceValidation'

const Router = express.Router()

Router.route('/addMember').post(
  verifyTokenManager,
  workspaceController.addMember
)

Router.route('/removeMember').post(workspaceController.removeMember)

Router.route('/createWorkspace').post(
  workspaceValidation.createNew,
  workspaceController.createWorkspace
)

Router.route('/update').post(
  verifyTokenUser,
  workspaceValidation.update,
  workspaceController.update
)

Router.route('/delete').post(workspaceController.deleteWorkspace)

Router.route('/getAll').get(verifyTokenAdmin, workspaceController.getAll)

export const workspaceRoute = Router
