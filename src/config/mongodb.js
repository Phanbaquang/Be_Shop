'use strict'
const mongoose = require('mongoose')
const mogoUrl =
  'mongodb+srv://quangquac1:3NtsC8lB7785fSS6@cluster0.olt4h3v.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
const connectDb = () => {
  return mongoose
    .connect(mogoUrl)
    .then(() => {
      console.log('connect db success !')
    })
    .catch((err) => console.log('error connect !', err))
}
module.exports = connectDb
