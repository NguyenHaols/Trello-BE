import { WHITELIST_DOMAINS } from '~/utils/constants'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://trello-project-five.vercel.app',
      'https://trello-project-42esrp36g-haos-projects-121cf72c.vercel.app'
    ]
    // Cho phép việc gọi API bằng POSTMAN trên môi trường dev,
    // Thông thường khi sử dụng postman thì cái origin sẽ có giá trị là undefined
    if (
      process.env.BUILD_MODE === 'dev' ||
      process.env.BUILD_MODE === 'production'
    ) {
      return callback(null, true)
    }

    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    }
    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    return callback(
      new ApiError(
        StatusCodes.FORBIDDEN,
        `${origin} not allowed by our CORS Policy.`
      )
    )
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,
  credentials: true,
  methods: 'GET,POST,PUT,DELETE', // Các phương thức được phép
  allowedHeaders: 'Content-Type,Authorization'
}

// export const corsOptions = {
//   origin: function (origin, callback) {
//     callback(null, true) // Cho phép tất cả các domain
//   },
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   optionsSuccessStatus: 200, // Cho các trình duyệt cũ xử lý HTTP 204
//   credentials: true // Cho phép nhận cookies từ request
// }
