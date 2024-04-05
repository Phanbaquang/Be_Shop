const mongoose = require('mongoose')
const { paginate } = require('./plugins/pagnigate')
const Schema = mongoose.Schema

const TransactionStatus = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
})

const transactionSchema = new Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
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
transactionSchema.plugin(paginate)
module.exports = mongoose.model('Transaction', transactionSchema)
