const UserModel = require('../models/User.model')
const AuthModel = require('../models/Auth.model')
exports.createUser = async (user) => {
  return await UserModel.create(user)
}
exports.findUserById = async (query) => {
  return await UserModel.findOne({ _id: query._id }).exec()
}

exports.updateAndCreateUser = async (query) => {
  return await UserModel.findOneAndUpdate(
    {
      _id: query._id
    },
    {
      $set: {
        ...query
      }
    },
    { new: true }
  )
}
exports.createToken = async (token) => {
  return await AuthModel.create(token)
}
exports.updateAccessToken = async (token) => {
  return await AuthModel.findOneAndUpdate(
    {
      mail: token.mail
    },
    {
      $set: {
        accessToken: token.accessToken
      }
    },
    { new: true }
  )
}
exports.findUserById = async (id) => {
  return await UserModel.findById(id)
}
exports.findUserByEmail = async (query) => {
  return await UserModel.findOne({ mail: query.mail }).exec()
}
