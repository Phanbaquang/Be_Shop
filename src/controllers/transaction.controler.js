'use strict'
const {
  getTransaction,
  deleteTransactionId,
  findTransactionById,
  updateAndCreateTransaction,
  getTransactionByMonth
} = require('../services/transaction.service')

const getTransactionControler = async (req, res) => {
  try {
    const respone = await getTransaction(req.query)
    return res.status(200).json(respone)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const getTransactionMonthControler = async (req, res) => {
  try {
    const response = await getTransactionByMonth(req.query)
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
const getTransactionId = async (req, res) => {
  try {
    const respone = await findTransactionById({ _id: req.query._id })
    if (!respone) return res.status(500).json({ error: 'Transaction not found' })
    return res.status(200).json(respone)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const updateTransactionId = async (req, res) => {
  try {
    const dataId = await findTransactionById({ _id: req.body._id })
    if (!dataId) return res.status(500).json({ error: 'Transaction not found' })
    const respone = await updateAndCreateTransaction({
      ...req.body,
      _id: req.body._id
    })
    return res.status(200).json(respone)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const deleteTransactionIdControler = async (req, res) => {
  try {
    const dataId = await findTransactionById({ _id: req.query._id })
    if (!dataId) {
      return res.status(403).json({ message: 'product not exist' })
    }
    await deleteTransactionId({ _id: req.query._id })
    return res.status(200).json({
      message: 'delete success !'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
module.exports = {
  getTransactionControler,
  getTransactionId,
  updateTransactionId,
  deleteTransactionIdControler,
  getTransactionMonthControler
}
