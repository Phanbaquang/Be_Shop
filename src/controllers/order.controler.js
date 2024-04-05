'use strict'
const { calcTotalPriceOrder } = require('../utils/algorithms')
const {
  createOrder,
  getOrder,
  updateAndCreateOrder,
  findOrderId,
  deleteOrderId,
  getOrderByMonth
} = require('../services/order.service')
const { createTransaction } = require('../services/transaction.service')
const { createNoti } = require('../services/notification.service.js')

const createOrderControler = async (req, res) => {
  try {
    const data = req.body
    const order = await createOrder({ ...data, total_price: calcTotalPriceOrder(data.products) })
    if (!order) {
      res.status(500).json({ error: 'transaction error' })
    }
    const transaction = await createTransaction({
      phone: req.body.phone,
      name: req.body.customer_name,
      order_id: order._id,
      customer_id: req.body.customer_id
    })
    await createNoti({
      order_id: order._id,
      customer_id: req.body.customer_id,
      message: ''
    })
    return res.status(200).json({ order, transaction })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const getOrderControler = async (req, res) => {
  try {
    const order = await getOrder(req.query)
    return res.status(200).json({
      order,
      totalCount: order.length
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getOrderMonthControler = async (req, res) => {
  try {
    const response = await getOrderByMonth(req.query)
    const monthsArray = Array.from({ length: 12 }, (_, i) => i + 1)

    const finalResult = monthsArray.map((month) => {
      const foundMonth = response.find((item) => item.month === month)
      return {
        month: month,
        count: foundMonth ? foundMonth.count : 0
      }
    })
    return res.status(200).json(finalResult)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const getOrderId = async (req, res) => {
  try {
    const order = await findOrderId({ _id: req.query._id })
    return res.status(200).json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const updateOrderId = async (req, res) => {
  try {
    const OrderId = await findOrderId({ _id: req.body._id })
    if (!OrderId) {
      return res.status(403).json({ message: 'Order not exist' })
    }
    const Order = await updateAndCreateOrder({
      ...req.body,
      _id: req.body._id
    })
    return res.status(200).json(Order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const deleteOrderIdControler = async (req, res) => {
  try {
    const OrderId = await findOrderId({ _id: req.query._id })
    if (!OrderId) {
      return res.status(403).json({ message: 'Order not exist' })
    }
    await deleteOrderId({ _id: req.query._id })
    return res.status(200).json({
      message: 'delete success !'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
module.exports = {
  createOrderControler,
  getOrderControler,
  getOrderId,
  updateOrderId,
  deleteOrderIdControler,
  getOrderMonthControler
}
