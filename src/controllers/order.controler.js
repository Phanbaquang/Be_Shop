'use strict'
const { calcTotalPriceOrder } = require('~/utils/algorithms')
const {
  createOrder,
  getOrder,
  updateAndCreateOrder,
  findOrderId,
  deleteOrderId
} = require('../services/order.service')
const { createTransaction } = require('../services/transaction.service')

const createOrderControler = async (req, res) => {
  try {
    const data = req.body
    const order = await createOrder({ ...data, total_price: calcTotalPriceOrder(data.products) })
    if (!order) {
      res.status(500).json({ error: 'transaction error' })
    }
    const transaction = await createTransaction({
      order_id: order._id,
      customer_id: req.body.customer_id
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
    const OrderId = await findOrderId({ _id: req.query._id })
    if (!OrderId) {
      return res.status(403).json({ message: 'Order not exist' })
    }
    const Order = await updateAndCreateOrder({
      ...req.body,
      _id: req.query._id
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
  deleteOrderIdControler
}
