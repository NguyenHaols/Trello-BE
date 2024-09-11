import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const REPORT_COLLECTION_NAME = 'report'
const REPORT_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().min(10).max(50).trim().strict(),
  title: Joi.string().required().min(10).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await REPORT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async(data) => {
  try {
    const afterValidate = await validateBeforeCreate(data)
    const createNew = await GET_DB().collection(REPORT_COLLECTION_NAME).insertOne(afterValidate)
    return createNew
  } catch (error) {
    throw new Error(error)
  }

}

const findById = async(id) => {
  try {
    const report = await GET_DB().collection(REPORT_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return report
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async() => {
  try {
    const reports = await GET_DB().collection(REPORT_COLLECTION_NAME).find({}).toArray()
    return reports
  } catch (error) {
    throw new Error(error)

  }
}

const removeById = async(id) => {
  try {
    const result = await GET_DB().collection(REPORT_COLLECTION_NAME).deleteOne({_id:new ObjectId(id)})
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const reportModel = {
  createNew,
  getAll,
  findById,
  removeById
}