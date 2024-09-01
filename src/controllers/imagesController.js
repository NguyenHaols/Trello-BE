import { StatusCodes } from 'http-status-codes'
import cloudinary from '~/config/cloudinaryConfig'
import mime from 'mime-types'

const upload = async(req, res, next) => {
  try {
    const image = req.file.path
    const result = await cloudinary.uploader.upload(image)
    const uploadedImage = {
      url:result.secure_url,
      publicId:result.public_id
    }
    return res.status(StatusCodes.OK).json({
      message: 'Upload successfully',
      data: uploadedImage
    })
  } catch (error) {
    next(error)
  }
}

const remove = async(req, res, next) => {
  try {
    const publicId = req.params.id
    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result === 'not found') {
      throw new Error('Delete image failed')
    }
    res.status(StatusCodes.OK).json({
      message:'Delete successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const uploadFile = async(req, res, next) => {
  try {
    const file = req.file.path
    const fileExtension = mime.extension(req.file.mimetype)
    const result = await cloudinary.uploader.upload(file, { resource_type: 'auto' })
    const uploadedFile = {
      url: result.secure_url,
      publicId: `${result.public_id}.${fileExtension}`,
      fileName: result.original_filename.replace(/\.[^/.]+$/, ''),
      fileExtension
    }
    return res.status(StatusCodes.OK).json({
      message: 'Upload file successfully',
      data: uploadedFile
    })
  } catch (error) {
    next(error)
  }
}

const removeFile = async(req, res, next) => {
  try {
    const publicId = req.params.id
    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result === 'not found') {
      throw new Error('Delete file failed')
    }
    res.status(StatusCodes.OK).json({
      message: 'Delete file successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const ImagesController = {
  upload,
  remove,
  uploadFile,
  removeFile
}