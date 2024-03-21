'use strict'
const { createFooter, getFooter, updateAndCreateFooter } = require('../services/footer.service')

const getfooterControler = async (req, res) => {
  try {
    const footer = await getFooter()
    return res.status(200).json(footer)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateAndCreatefooterId = async (req, res) => {
  try {
    const data = req.body
    const footer = await getFooter()
    if (footer.length === 0) {
      const footer = await createFooter({ ...data })
      return res.status(200).json(footer)
    }
    const updatefooter = await updateAndCreateFooter({
      ...req.body,
      _id: footer[0]._id
    })
    return res.status(200).json(updatefooter)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getfooterControler,
  updateAndCreatefooterId
}
