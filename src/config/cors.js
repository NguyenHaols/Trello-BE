import cors from 'cors'

const corsOptions = {
  origin: '*', // Chấp nhận tất cả domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các method được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
  credentials: true, // Cho phép gửi cookies và các thông tin xác thực
  optionsSuccessStatus: 200 // Đảm bảo trạng thái 200 cho preflight request
}

export default cors(corsOptions)
