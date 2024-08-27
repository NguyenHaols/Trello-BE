import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  status: Joi.string().min(3).max(50).trim().strict().default('Good'),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional().default(''),
  members: Joi.array().items(Joi.object().unknown(true).default).default([]),
  tasks: Joi.array().items(Joi.object().unknown(true).default).default([]),
  attachs: Joi.array().items(Joi.object().unknown(true).default).default([]),
  comments: Joi.array().items(Joi.object().unknown(true).default).default([]),
  deadline: Joi.date().timestamp('javascript').default(() => new Date(Date.now() + 24 * 60 * 60 * 1000)),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({
        columnId: new ObjectId(columnId)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByBoardId = async (boardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({
        boardId: new ObjectId(boardId)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findUserInCard = async (cardId, userEmail) => {
  try {
    const card = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(cardId)
      })
    if (card) {
      const user = card.members.find((member) => member.email === userEmail)
      return user // Trả về user nếu được tìm thấy trong mảng members
    } else {
      return null // Trả về null nếu không tìm thấy workspace
    }
  } catch (error) {
    throw new Error(error)
  }
}

const addMember = async (cardId, user) => {
  try {
    const checkUser = await findUserInCard(cardId, user.email)
    if (checkUser) {
      throw new Error('User already exist')
    }
    const card = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(cardId)
        },
        {
          $push: {
            members: user
          }
        },
        { returnDocument: 'after' }
      )

    return card
  } catch (error) {
    throw new Error(error)
  }
}

const removeMember = async (cardId, userId) => {
  try {
    const card = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateOne(
        {
          _id: new ObjectId(cardId)
        },
        {
          $pull: {
            members: {_id : new ObjectId(userId)}
          }
        }
      )
    return card
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }
    const createdCard = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(newCardToAdd)
    return createdCard
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  try {
    // Lọc ra fields không được sửa
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    if (updateData.columnId) {
      updateData.columnId = new ObjectId(updateData.columnId)
    }

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addTask = async (cardId, newTask) => {
  try {
    if (!newTask._id) {
      newTask._id = new ObjectId()
    }
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $push: { tasks: newTask } },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addAttachment = async (cardId, newAttach) => {
  try {
    if (!newAttach._id) {
      newAttach._id = new ObjectId()
    }
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $push: { attachs: newAttach } },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const removeTaskById = async (cardId, taskId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $pull: { tasks: { _id: new ObjectId(taskId) } } },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateTaskAssign = async (cardId, taskId, taskStatus, userId) => {
  try {
    const card = await findOneById(cardId)
    if (!card) {
      throw new Error('CardId not found')
    }
    const index = card.tasks.findIndex((task) => task._id.equals(new ObjectId(taskId)))
    if (index === -1) {
      throw new Error('Task not found')
    }
    card.tasks[index].taskStatus = taskStatus
    card.tasks[index].userId = userId
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(cardId) }, { $set: { tasks: card.tasks } })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateTaskTime = async (cardId, taskId, deadline) => {
  try {
    const card = await findOneById(cardId)
    if (!card) {
      throw new Error('CardId not found')
    }
    const index = card.tasks.findIndex((task) => task._id.equals(new ObjectId(taskId)))
    if (index === -1) {
      throw new Error('Task not found')
    }
    card.tasks[index].deadline = deadline
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(cardId) }, { $set: { tasks: card.tasks } })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateTask = async (cardId, taskId, taskStatus) => {
  try {
    const card = await findOneById(cardId)
    if (!card) {
      throw new Error('CardId not found')
    }
    const index = card.tasks.findIndex((task) => task._id.equals(new ObjectId(taskId)))
    if (index === -1) {
      throw new Error('Task not found')
    }
    card.tasks[index].taskStatus = taskStatus
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(cardId) }, { $set: { tasks: card.tasks } })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (cardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(cardId)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId,
  addMember,
  deleteOneById,
  updateTask,
  addTask,
  deleteManyByBoardId,
  removeTaskById,
  removeMember,
  updateTaskAssign,
  updateTaskTime
}
