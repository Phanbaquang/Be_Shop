const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String },
    imageName: { type: Array, default: [] }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Category', categorySchema)
