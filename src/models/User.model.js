const mongoose = require('mongoose')
const { paginate } = require('./plugins/pagnigate')
const Schema = mongoose.Schema
const UserEnums = Object.freeze({
  ADMIN: '081999',
  USER: '211199'
})

const userSchema = new Schema(
  {
    mail: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: false, default: '' },
    address: { type: String, required: false, default: '' },
    description: { type: String, required: false, default: '' },
    profession: { type: String, required: false, default: '' },
    image: { type: String, default: '' },
    role: {
      type: String,
      enum: Object.values(UserEnums),
      default: UserEnums.USER
    },
    imageName: { type: Array, default: [] }
  },
  {
    timestamps: true
  }
)
userSchema.plugin(paginate)
module.exports = mongoose.model('User', userSchema)
