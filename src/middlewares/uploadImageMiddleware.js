const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { default: cloudinary } = require('~/config/cloudinaryConfig')


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: 'itWorksImage',
      allowedFormats: ['jpg', 'png']
    }
  }
})

const upload = multer({ storage: storage })

export { storage, upload }
