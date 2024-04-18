import express from 'express'
import { ImagesController } from '~/controllers/imagesController'
import { upload } from '~/middlewares/uploadImageMiddleware'


const Router = express.Router()


Router.route('/upload')
  .post(upload.single('image'), ImagesController.upload)

Router.route('/remove/:id')
  .delete(ImagesController.remove)



export const uploadImage = Router