const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173/']
  }
})

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnect')
  })

  socket.on('new_user_login', (data) => {
    console.log(data)
    socket.broadcast.emit('new_user_login', { message: data.message })
  })
})

module.exports = { app, io, server }
