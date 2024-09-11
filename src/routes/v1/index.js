import express from 'express'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
import { userRoute } from './userRoute'
import { uploadImage } from './uploadImage'
import { workspaceRoute } from './workspaceRoute'
import { commentRoute } from './commentRoute'
import { emailRoute } from './emailRoute'
import { codeRecoverRoute } from './codeRecoverRoute'
import { roleRoute } from './roleRoute'
import { memberRoute } from './memberRoute'
import { auth20 } from './authRoute'
import { notificationsRoute } from './notificationRoute'
import { reportRoute } from './reportRoute'


const Router = express.Router()

Router.use('/boards', boardRoute)

Router.use('/columns', columnRoute)

Router.use('/cards', cardRoute)

Router.use('/users', userRoute)

Router.use('/image', uploadImage)

Router.use('/workspaces', workspaceRoute)

Router.use('/comments', commentRoute)

Router.use('/email', emailRoute)

Router.use('/codeRecover', codeRecoverRoute)

Router.use('/roles', roleRoute)

Router.use('/workspace/member', memberRoute)

Router.use('/auth', auth20)

Router.use('/notifications', notificationsRoute)

Router.use('/report', reportRoute)


export const APIs_V1 = Router
