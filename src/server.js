const express = require('express')

const app = express()

const hostname ='localhost'
const port = 1303

app.get('/', function (req, res) {
    res.send('Hello World')
  })
  
app.listen(port,hostname, () => {
    console.log('test')
})