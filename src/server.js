const express = require('express')
const connectDb = require('./config/mongodb')

const bodyParser = require('body-parser')
const { app, server } = require('./sockets/socket')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const { createOrder, captureOrder } = require('./setupPaypal')
// const app = express()
dotenv.config()

app.use(cors())
app.options('*', cors())
const hostname = 'localhost'
const port = 8017
app.use(bodyParser.json())
connectDb()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('', require('./routes/v1/index'))
app.post('/api/orders', async (req, res) => {
  try {
    console.log('namdz')
    const { cart } = req.body
    const { jsonResponse, httpStatusCode } = await createOrder(cart)
    res.status(httpStatusCode).json(jsonResponse)
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to create order.' })
  }
})

app.post('/api/orders/:orderID/capture', async (req, res) => {
  try {
    const { orderID } = req.params
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID)
    res.status(httpStatusCode).json(jsonResponse)
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to capture order.' })
  }
})
app.get('/', (req, res) => {
  res.end('<h1>Hello World!</h1><hr>')
})
server.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(` I am running at ${hostname}:${port}`)
})
