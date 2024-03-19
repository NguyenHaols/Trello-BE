/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqbody) => {
  try {
    const newCard = {
      ...reqbody,
    }

    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }
    // console.log(getNewCard)
    return getNewCard
  } catch (error) {
    throw error
  }

}

const getDetail = async (cardId) => {
  try {

    // Lấy dữ liệu từ DB
    const card = await cardModel.getDetail(cardId)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
    }

    // Clone lại từ dữ liệu ban đầu và sửa lại cấu trúc dữ liệu trả ra
    const resCard = cloneDeep(card)
    resCard.cards.forEach(card => {
      card.cards = resCard.cards.filter(card => card.cardId.equals(card._id))
    })
    delete resCard.cards

    return resCard
  } catch (error) {
    throw error
  }

}

export const cardService = {
  createNew,
  getDetail
}