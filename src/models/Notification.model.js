const mongoose = require('mongoose')
const Schema = mongoose.Schema
const notiSchema = new Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    message: { type: String, default: '' },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
)
module.exports = mongoose.model('Notification', notiSchema)
