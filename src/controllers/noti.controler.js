const { getNoti, findNotiId, updateAndCreateNoti } = require('../services/notification.service')

const getNotiController = async (req, res) => {
  try {
    const noti = await getNoti(req.query)
    return res.status(200).json(noti)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateNotiId = async (req, res) => {
  try {
    const data = req.body
    const dataId = await findNotiId(data)
    if (!dataId) {
      return res.status(500).json({ message: 'Thông báo này không tồn tại' })
    }
    const updatefooter = await updateAndCreateNoti({
      ...req.body,
      read: true,
      _id: dataId._id
    })
    return res.status(200).json(updatefooter)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getNotiController,
  updateNotiId
}
