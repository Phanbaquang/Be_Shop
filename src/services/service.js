const UserModel = require('../models/User.model')
const AuthModel = require('../models/Auth.model')
exports.createUser = async (user) => {
  return await UserModel.create(user)
}
exports.findUserById = async (query) => {
  return await UserModel.findOne({ _id: query._id }).exec()
}

exports.getUserAll = async (query) => {
  return await UserModel.paginate(query)
}
exports.getUserByMonth = async () => {
  const year = new Date().getFullYear()
  return await UserModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        month: '$_id', // Sử dụng trường _id để tạo trường mới month
        count: 1,
        _id: 0 // Loại bỏ trường _id
      }
    },
    {
      $sort: { month: 1 }
    }
  ])
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
exports.deleteUserId = async (query) => {
  return await UserModel.deleteOne({ _id: query._id })
}
exports.findUserByEmail = async (query) => {
  return await UserModel.findOne({ mail: query.mail }).exec()
}
exports.findUserByPhone = async (query) => {
  return await UserModel.findOne({ phone: query.phone }).exec()
}
