const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserEnums = Object.freeze({
  ADMIN: '081999',
  USER: '211199'
})

const authSchema = new Schema(
  {
    mail: String,
    password: String,
    accessToken: String,
    refreshToken: { type: Array, default: [] },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    role: {
      type: String,
      enum: Object.values(UserEnums),
      default: UserEnums.USER
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Auth', authSchema)
