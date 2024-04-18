import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  AUTHOR: process.env.AUTHOR,
  BUILD_MODE: process.env.BUILD_MODE,
  JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
  JWT_REFESH_KEY :  process.env.JWT_REFESH_KEY,
  CLOUD_NAME : process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUND_API_SECRET: process.env.CLOUND_API_SECRET
}