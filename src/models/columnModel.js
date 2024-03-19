import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}

const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// update giá trị cardOrderIds
const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      { $push: { cardOrderIds: new ObjectId(card._id) } },
      { returnDocument:'after' }
    )

    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

// const getDetail = async(boardId) => {
//   try {
//     const result = await GET_DB().collection(COLUMN_COLLECTION_NAME)
//       .aggregate([
//         {
//           $match: {
//             _id : new ObjectId(boardId),
//             _destroy: false
//           }
//         },
//         {
//           $lookup: {
//             from: columnModel.COLUMN_COLLECTION_NAME,
//             localField: '_id',
//             foreignField: 'boardId',
//             as: 'columns'
//           }
//         },
//         {
//           $lookup: {
//             from: cardModel.CARD_COLLECTION_NAME,
//             localField: '_id',
//             foreignField: 'boardId',
//             as: 'cards'
//           }
//         }
//       ]).toArray()

//     return result[0] || null
//   } catch (error) {
//     throw new Error(error)
//   }
// }

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    // Sau khi validate thi id van la string nen can bien doi lai du lieu sang objectId
    const newColumnToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }
    const createdColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)
    return createdColumn
  } catch (error) {
    throw new Error(error)
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds
  // getDetail
}