
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { default: cloudinary } = require('~/config/cloudinaryConfig')
const mime = require('mime-types')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const extension = mime.extension(file.mimetype)
    const originalName = file.originalname // Tên tệp gốc
    const timestamp = Date.now() // Lấy thời gian hiện tại (timestamp)
    return {
      folder: 'itWorksFile',
      allowedFormats: ['docx', 'xlsx', 'pptx', 'pdf', 'doc'],
      resource_type: 'auto',
      public_id: `${timestamp}_${originalName.replace(/\.[^/.]+$/, '')}`,
      format: extension
    }
  }
})

const uploadFile = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } })

export { storage, uploadFile }
