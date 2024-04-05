const mongoose = require('mongoose')
const { paginate } = require('./plugins/pagnigate')
const Schema = mongoose.Schema

const productSchema = new Schema(
  {
    productName: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    imageName: { type: Array, default: [] },
    price: { type: String, required: true },
    description: { type: String, required: true },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    type: { type: String },
    status: { type: Boolean, required: true },
    inStore: { type: String, required: true },
    weight: { type: String },
    size: { type: String },
    color: { type: String },
    promoteType: { type: Boolean },
    promotePrice: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'fixed'
    }
  },
  {
    timestamps: true
  }
)
productSchema.plugin(paginate)
module.exports = mongoose.model('Product', productSchema)
