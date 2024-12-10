/* eslint-disable no-console */

import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import { env } from './config/environment'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import './passport'
import http from 'http'
import { Server } from 'socket.io'
import { workspaceService } from './services/workspaceService'
import { workspaceModel } from './models/workspaceModel'
import { userService } from './services/userService'
import { notificationsService } from './services/notificationsService'

const START_SERVER = () => {
  const app = express()

  app.use(cookieParser())

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIs_V1)

  app.use(passport.initialize())

  const server = http.createServer(app)
  const io = new Server(server, {
    cors: {
      origin: 'https://trello-project-tau.vercel.app',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  let onlineUsers = []
  const addOnlineUser = (email, socketId) => {
    !onlineUsers.some((user) => user.email === email) &&
      onlineUsers.push({ email, socketId })
  }
  const removeOnlineUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
  }
  const getUserOnline = (email) => {
    return onlineUsers.find((user) => user.email === email)
  }

  io.on('connection', (socket) => {
    socket.on('newUser', (userId) => {
      addOnlineUser(userId, socket.id)
      console.log(onlineUsers)
    })

    socket.on('invite', async (data) => {
      // console.log(data)
      const userReceiver = await userService.findOneByEmail(data.emailInvite)
      const workspace = await workspaceModel.findOneById(data.workspaceId)
      const invitedEmail = getUserOnline(data.emailInvite)
      const message = 'You have been added to workspace of'
      const newNotification = {
        senderId: data.inviterId,
        receiverId: userReceiver._id.toString(),
        content: message,
        workspaceId: data.workspaceId
      }
      const notification = await notificationsService.createNew(newNotification)
      // console.log(invitedEmail)
      // console.log(invitedEmail.socketId, 'Đã gửi đi emit invited-Noti')
      socket
        .to(invitedEmail?.socketId)
        .emit('invited-Notification', { message })
    })

    socket.on('removeMember', async (data) => {
      const member = getUserOnline(data.emailRemove)
      const workspace = await workspaceModel.findOneById(data.workspaceId)
      const userReceiver = await userService.findOneByEmail(data.emailRemove)
      const message = 'You have been remove from workspace of'
      const newNotification = {
        senderId: data.senderId,
        receiverId: userReceiver._id.toString(),
        content: message,
        workspaceId: data.workspaceId
      }
      const notification = await notificationsService.createNew(newNotification)
      if (member) {
        socket.to(member.socketId).emit('remove-Nofication', {
          message
        })
      }
    })

    // socket.on('roomChat', async(data) => {
    //   const {senderId, receiverId} = data
    //   const roomId =

    // })

    socket.on('disconnect', () => {
      removeOnlineUser(socket.id)
      // console.log(onlineUsers)
    })
  })
  // Middleware
  app.use(errorHandlingMiddleware)

  app.get('/', (req, res) => {
    res.end('<h1>BACK END SERVER</h1><hr>')
  })

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(
        `I am ${env.AUTHOR} running at :${process.env.PORT} in production`
      )

      exitHook(() => {
        console.log('App closed')
        CLOSE_DB()
      })
    })
  } else {
    server.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(
        `I am ${env.AUTHOR} running at ${env.APP_HOST}:${env.APP_PORT}`
      )

      exitHook(() => {
        console.log('App closed')
        CLOSE_DB()
      })
    })
  }
}

;(async () => {
  try {
    await CONNECT_DB()
    console.log('connected to MongoDB Cloud Atlas')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then( () => console.log('connected to MongoDB Cloud Atlas'))
//   .then( () => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
