'use strict'
const {
  getTransaction,
  deleteTransactionId,
  findTransactionById,
  updateAndCreateTransaction
} = require('../services/transaction.service')

const getTransactionControler = async (req, res) => {
  try {
    const respone = await getTransaction(req.query)
    return res.status(200).json({
      respone,
      totalCount: respone.length
    })
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
    const dataId = await findTransactionById({ _id: req.query._id })
    if (!respone) return res.status(500).json({ error: 'Transaction not found' })
    if (!dataId) {
      return res.status(403).json({ message: 'product not exist' })
    }
    const respone = await updateAndCreateTransaction({
      ...req.body,
      _id: req.query._id
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
  deleteTransactionIdControler
}
