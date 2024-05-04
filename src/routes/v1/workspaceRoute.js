import express from 'express'
import { workspaceController } from '~/controllers/workspaceController'
import { workspaceValidation } from '~/validations/workspaceValidation'


const Router = express.Router()

Router.route('/addMember')

  .post(workspaceController.addMember)

Router.route('/removeMember')

  .post(workspaceController.removeMember)

Router.route('/createWorkspace')

  .post(workspaceValidation.createNew, workspaceController.createWorkspace)

Router.route('/update')

  .post(workspaceValidation.update, workspaceController.update)

Router.route('/delete')

  .post(workspaceController.deleteWorkspace)


export const workspaceRoute = Router