'use strict'
const { createContact, getContact, updateAndCreateContact } = require('../services/contact.service')
const cloudinary = require('cloudinary').v2

const getContactControler = async (req, res) => {
  try {
    const contact = await getContact()
    return res.status(200).json(contact)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateAndCreateContactId = async (req, res) => {
  try {
    const data = req.body
    const contact = await getContact()
    if (contact.length === 0) {
      if (!req.file?.path) {
        return res.status(403).json({ message: 'image is required' })
      }
      const contact = await createContact({
        ...data,
        image: req.file.path,
        imageName: req.file.filename
      })
      return res.status(200).json(contact)
    } else {
      if (!req.file?.path) {
        const updateContact = await updateAndCreateContact({
          ...req.body,
          _id: contact[0]._id,
          image: contact[0].image,
          imageName: contact[0].imageName
        })
        return res.status(200).json(updateContact)
      }
      const updateContact = await updateAndCreateContact({
        ...req.body,
        _id: contact[0]._id,
        image: req.file.path,
        imageName: req.file.filename
      })
      cloudinary.uploader.destroy(req.body?.imageName)
      return res.status(200).json(updateContact)
    }
  } catch (err) {
    cloudinary.uploader.destroy(req.file?.filename)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getContactControler,
  updateAndCreateContactId
}
