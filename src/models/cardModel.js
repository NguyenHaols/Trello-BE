import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}

const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// const getDetail = async(boardId) => {
//   try {
//     const result = await GET_DB().collection(CARD_COLLECTION_NAME)
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
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)

    }
    const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    return createdCard
  } catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  // getDetail
}