import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().min(10).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  username: Joi.string().required().min(3).max(50).trim().strict(),
  password: Joi.string().required().min(5).trim().strict(),
  roleId: Joi.string().default('1'),
  avatar:Joi.string().default('').optional(),
  phoneNumber: Joi.string().required().min(9).max(11).trim().strict(),
  starredBoard: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  const emailExists = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: data.email })
  if (emailExists) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Email aready exsit')
  }
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async(email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email
    })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async() => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).find({}).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateUser = async (newData) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { email: newData.email },
      { $set: {
        username: newData.username,
        phoneNumber : newData.phoneNumber,
        avatar: newData.avatar,
        updatedAt: Date.now()
      } },
      { returnDocument:'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addStarredBoard = async (userId, starredBoardId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId)},
      { $addToSet: {starredBoard : starredBoardId} },
      { returnDocument:'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const removeStarredBoard = async (userId, starredBoardId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId)},
      { $pull: {starredBoard : starredBoardId} },
      { returnDocument:'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updatePassword = async (email, newPassword) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { email: email },
      { $set: {
        password : newPassword,
        updatedAt: Date.now()
      } },
      { returnDocument:'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}




export const userModel = {
  createNew,
  findOneById,
  findOneByEmail,
  getAll,
  updateUser,
  updatePassword,
  addStarredBoard,
  removeStarredBoard
}