const OrderModel = require('../models/Order.model')

exports.createOrder = async (data) => {
  return await OrderModel.create(data)
}
exports.getOrder = async (query) => {
  return await OrderModel.find(query).sort({
    createdAt: -1
  })
}
exports.getOrderByMonth = async () => {
  const year = new Date().getFullYear()
  return await OrderModel.aggregate([
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
