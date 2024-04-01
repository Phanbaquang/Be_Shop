const express = require('express')
const connectDb = require('./config/mongodb')

const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const app = express()
dotenv.config()

app.use(cors())
app.options('*', cors())
const hostname = 'localhost'
const port = 8000
app.use(bodyParser.json())
connectDb()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('', require('./routes/v1/index'))
app.get('/', (req, res) => {
  res.end('<h1>Hello World!</h1><hr>')
})
app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(` I am running at ${hostname}:${port}`)
})
