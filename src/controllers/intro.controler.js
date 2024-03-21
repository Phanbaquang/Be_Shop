'use strict'
const { createIntro, getIntro, updateAndCreateIntro } = require('../services/intro.service')
const cloudinary = require('cloudinary').v2

const getIntroControler = async (req, res) => {
  try {
    const Intro = await getIntro()
    return res.status(200).json(Intro)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateAndCreateIntroId = async (req, res) => {
  try {
    const data = req.body
    const Intro = await getIntro()
    if (Intro.length === 0) {
      if (!req.file?.path) {
        return res.status(403).json({ message: 'image is required' })
      }
      const Intro = await createIntro({
        ...data,
        image: req.file.path,
        imageName: req.file.filename
      })
      return res.status(200).json(Intro)
    } else {
      if (!req.file?.path) {
        const updateIntro = await updateAndCreateIntro({
          ...req.body,
          _id: Intro[0]._id,
          image: Intro[0].image,
          imageName: Intro[0].imageName
        })
        return res.status(200).json(updateIntro)
      }
      const updateIntro = await updateAndCreateIntro({
        ...req.body,
        _id: Intro[0]._id,
        image: req.file.path,
        imageName: req.file.filename
      })
      cloudinary.uploader.destroy(req.body?.imageName)
      return res.status(200).json(updateIntro)
    }
  } catch (err) {
    cloudinary.uploader.destroy(req.file?.filename)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getIntroControler,
  updateAndCreateIntroId
}
