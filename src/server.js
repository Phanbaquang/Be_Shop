import express from 'express'
import connectDb from './config/mongodb'
import { app, server } from './sockets/socket'
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
dotenv.config()

app.use(cors())
app.options('*', cors())
const hostname = 'localhost'
const port = 8017
app.use(bodyParser.json())
connectDb()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('', require('./routes/v1/index'))
app.get('/', (req, res) => {
  res.end('<h1>Hello World!</h1><hr>')
})
server.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(` I am running at ${hostname}:${port}`)
})
