const TransactionModel = require('../models/Transaction.model')

exports.createTransaction = async (data) => {
  return await TransactionModel.create(data)
}
exports.getTransaction = async ({ minPrice, maxPrice }) => {
  let query = {}

  if (minPrice !== undefined && maxPrice !== undefined) {
    query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
  }
  return await TransactionModel.find(query)
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
