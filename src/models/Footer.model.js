const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    footerCol1: { type: String, required: true },
    title_footer_col1: { type: String, required: true },
    footerCol2: { type: String, required: true },
    title_footer_col2: { type: String, required: true },
    footerCol3: { type: String, required: true },
    title_footer_col3: { type: String, required: true },
    titleSubFooter: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String, default: '' },
    mail: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Footer', userSchema)
