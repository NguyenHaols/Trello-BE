/* eslint-disable no-console */

import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()

  app.use(cookieParser())

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIs_V1)


  // Middleware
  app.use(errorHandlingMiddleware)

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`I am ${env.AUTHOR} running at :${ process.env.PORT } in production`)

      exitHook(() => {
        console.log('App closed')
        CLOSE_DB()
      })
    })
  } else {
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`I am ${env.AUTHOR} running at ${ env.APP_HOST }:${ env.APP_PORT }`)

      exitHook(() => {
        console.log('App closed')
        CLOSE_DB()
      })
    })
  }

}

(async () => {
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


