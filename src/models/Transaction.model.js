const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionStatus = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
})

const categorySchema = new Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status_payment: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Transaction', categorySchema)
