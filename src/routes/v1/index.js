import express from 'express'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
import { userRoute } from './userRoute'
import { uploadImage } from './uploadImage'

const Router = express.Router()


Router.use('/boards', boardRoute)

Router.use('/columns', columnRoute)

Router.use('/cards', cardRoute)

Router.use('/users', userRoute)

Router.use('/image', uploadImage)

export const APIs_V1 = Router