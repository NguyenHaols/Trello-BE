/* eslint-disable no-console */

import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB, } from '~/config/mongodb'
import { env } from '~/config/environment'


const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', async (req, res) => {
    // console.log(await GET_DB().listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`I am ${env.AUTHOR} running at ${ env.APP_HOST }:${ env.APP_PORT }`)

    exitHook(() => {
      console.log('App closed')
      CLOSE_DB()
    })
  })
}

(async () => {
  try {
    console.log('connecting to MongoDB Cloud Atlas')
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


