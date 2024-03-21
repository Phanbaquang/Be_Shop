const OrderModel = require('../models/Order.model')

exports.createOrder = async (data) => {
  return await OrderModel.create(data)
}
exports.getOrder = async (query) => {
  return await OrderModel.find(query)
}
exports.findOrderId = async (query) => {
  return await OrderModel.findOne({ _id: query._id }).exec()
}
exports.updateAndCreateOrder = async (query) => {
  return await OrderModel.findOneAndUpdate(
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
exports.deleteOrderId = async (query) => {
  return await OrderModel.deleteOne({ _id: query._id })
}
