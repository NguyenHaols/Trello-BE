import express from 'express'
import { ImagesController } from '~/controllers/imagesController'
import { uploadFile } from '~/middlewares/uploadFile'
import { upload } from '~/middlewares/uploadImageMiddleware'


const Router = express.Router()


Router.route('/upload')
  .post(upload.single('image'), ImagesController.upload)

Router.route('/remove/:id')
  .delete(ImagesController.remove)

Router.route('/uploadFile')
  .post(uploadFile.single('file'), ImagesController.uploadFile)

Router.route('/removeFile/:id')
  .delete(ImagesController.removeFile)

export const uploadImage = Router