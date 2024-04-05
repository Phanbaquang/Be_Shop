const TransactionModel = require('../models/Transaction.model')

exports.createTransaction = async (data) => {
  return await TransactionModel.create(data)
}
exports.getTransaction = async (query) => {
  return await TransactionModel.paginate(query)
}
exports.getTransactionByMonth = async () => {
  const year = new Date().getFullYear()
  return await TransactionModel.aggregate([
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
exports.findTransactionById = async (query) => {
  return await TransactionModel.findOne({ _id: query._id }).exec()
}
exports.updateAndCreateTransaction = async (query) => {
  return await TransactionModel.findOneAndUpdate(
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
exports.deleteTransactionId = async (query) => {
  return await TransactionModel.deleteOne({ _id: query._id })
}
