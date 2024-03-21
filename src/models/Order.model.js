const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PaymentMethods = Object.freeze({
  PAYMENT_ON_DELIVERY: 'payment_on_delivery',
  BANK_TRANSFER: 'bank_transfer'
})
const productSchema = new Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: String, required: true },
  price: { type: String, required: true }
})
const shippingAddressSchema = new Schema({
  address_line1: { type: String, required: true },
  address_line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  payment_method: {
    type: String,
    enum: Object.values(PaymentMethods),
    default: PaymentMethods.PAYMENT_ON_DELIVERY
  }
})
const orderSchema = new Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [productSchema],
    shipping_address: shippingAddressSchema,
    total_price: { type: String }
  },
  { timestamps: true }
)
module.exports = mongoose.model('Order', orderSchema)
