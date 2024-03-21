const mongoose = require('mongoose')
const Schema = mongoose.Schema

const authSchema = new Schema(
  {
    mail: String,
    password: String,
    accessToken: String,
    refreshToken: { type: Array, default: [] },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Auth', authSchema)
