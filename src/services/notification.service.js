const NotificationModel = require('../models/Notification.model')

exports.createOrder = async (data) => {
  return await NotificationModel.create(data)
}
exports.getOrder = async (query) => {
  return await NotificationModel.find(query)
}
exports.findOrderId = async (query) => {
  return await NotificationModel.findOne({ _id: query._id }).exec()
}
exports.updateAndCreateOrder = async (query) => {
  return await NotificationModel.findOneAndUpdate(
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
  return await NotificationModel.deleteOne({ _id: query._id })
}
