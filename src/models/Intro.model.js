const mongoose = require('mongoose')
const Schema = mongoose.Schema

const introSchema = new Schema(
  {
    description: { type: String, default: '' },
    name: { type: String, required: true },
    image: { type: String, required: true },
    imageName: { type: Array, default: [] }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Intro', introSchema)
