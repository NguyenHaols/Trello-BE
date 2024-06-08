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

export const APIs_V1 = Router
