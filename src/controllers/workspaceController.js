import { StatusCodes } from 'http-status-codes'
import { workspaceService } from '~/services/workspaceService'

const addMember = async (req, res, next) => {
  try {
    const result = await workspaceService.addMember(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res.status(StatusCodes.NOT_FOUND).json('Add member Failure')
    }
  } catch (error) {
    next(error)
  }
}

const removeMember = async (req, res, next) => {
  try {
    const result = await workspaceService.removeMember(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res.status(StatusCodes.NOT_FOUND).json('Remove Failure')
    }
  } catch (error) {
    next(error)
  }
}

const createWorkspace = async (req, res, next) => {
  try {
    const result = await workspaceService.createWorkspace(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res.status(StatusCodes.NOT_FOUND).json('Create failed')
    }
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await workspaceService.update(req.body)
    if (result) {
      return res.status(StatusCodes.OK).json(result)
    } else {
      return res.status(StatusCodes.NOT_FOUND).json('Update failure')
    }
  } catch (err) {
    next(err)
  }
}

const deleteWorkspace = async (req, res, next) => {
  try {
    const result = await workspaceService.deleteOneById(req.body)
    if (result.acknowledged && result.deletedCount > 0) {
      return res.status(StatusCodes.OK).json({ message: 'Delete successfully' })
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Delete Failure' })
    }
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const workspaces = await workspaceService.getAll()
    return res.status(StatusCodes.OK).json(workspaces)
  } catch (error) {
    next(error)
  }
}

// const findManagerById = async (req, res, next, userId, workspaceId) => {
//   try {
//     const isManager = await workspaceService.findManagerById(
//       userId,
//       workspaceId
//     )
//     return isManager
//   } catch (error) {
//     next()
//   }
// }

export const workspaceController = {
  addMember,
  removeMember,
  createWorkspace,
  update,
  deleteWorkspace,
  getAll
}
