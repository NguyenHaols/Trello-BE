/* eslint-disable no-useless-catch */
import { reportModel } from '~/models/reportModel'

const createNew = async(reqBody) => {
  try {
    const { email, title, description } = reqBody
    const result = await reportModel.createNew({email, title, description})
    const newReport = await reportModel.findById(result.insertedId)
    return newReport
  } catch (error) {
    throw error
  }
}

const deleteOne = async(reqBody) => {
  try {
    const id = reqBody._id
    const result = await reportModel.removeById(id)
    return result.deletedCount > 0 ? result : null
  } catch (error) {
    throw error
  }
}

const getAll = async() => {
  try {
    const reports = reportModel.getAll()
    return reports
  } catch (error) {
    throw error
  }
}

export const reportService = {
  createNew,
  getAll,
  deleteOne
}