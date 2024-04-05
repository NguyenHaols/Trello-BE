/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter'
import { userModel } from '~/models/userModel'

const createNew = async (reqbody) => {
  try {
    const newUser = {
      ...reqbody,
      slug: slugify(reqbody.username)
    }

    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    return getNewUser
  } catch (error) {
    throw error
  }

}


export const userdService = {
  createNew,


}