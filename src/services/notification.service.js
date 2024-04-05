const NotificationModel = require('../models/Notification.model')

exports.createNoti = async (data) => {
  return await NotificationModel.create(data)
}
exports.getNoti = async (query) => {
  return await NotificationModel.find(query)
}
exports.findNotiId = async (query) => {
  return await NotificationModel.findOne({ _id: query._id }).exec()
}
exports.updateAndCreateNoti = async (query) => {
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
exports.deleteNotiId = async (query) => {
  return await NotificationModel.deleteOne({ _id: query._id })
}
