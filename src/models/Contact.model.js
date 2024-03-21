const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactSchema = new Schema(
  {
    title: { type: String, required: true },
    textTitle: { type: String, required: true },
    subTitle: { type: String, required: true },
    textSubTitle: { type: String, required: true },
    image: { type: String, default: '' },
    imageName: { type: Array, default: [] },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Contact', contactSchema)
