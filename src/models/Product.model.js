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
    descriptionDetail: { type: String, required: true },
    category_id: { type: String },
    sale: Number,
    type: { type: String },
    hot: { type: Boolean, default: false },
    // status: { type: Boolean, required: true },
    inStore: { type: String, },
    weight: { type: String },
    color: { type: [String] },
    promoteType: { type: Boolean },
    promotePrice: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'fixed'
    },
    // size: { type: String }
    sizeDetail: [
      {
        color: {
          name: { type: String, required: true },
          codeColor: { type: String, required: true },
          id: { type: String, required: true }
        },
        size: [
          {
            sizeName: { type: String, required: true },
            quantity: { type: Number, required: true }
          }
        ]
      }
    ]
  },
  {
    timestamps: true
  }
)
productSchema.plugin(paginate)
module.exports = mongoose.model('Product', productSchema)
