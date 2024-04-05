'use strict'
const service = require('../services/category.service')
const cloudinary = require('cloudinary').v2

const createCategory = async (req, res) => {
  try {
    const data = req.body
    const categoryId = await service.findCategoryByName({ name: req.body.name })
    if (categoryId) {
      cloudinary.uploader.destroy(req.file?.filename)
      return res.status(403).json({ message: 'category exist' })
    }
    if (!req.file?.path) {
      return res.status(403).json({ message: 'image is required' })
    }
    const category = await service.createCategory({
      ...data,
      image: req.file.path,
      imageName: req.file.filename
    })
    return res.status(200).json(category)
  } catch (err) {
    cloudinary.uploader.destroy(req.file?.filename)
    res.status(500).json({ error: err.message })
  }
}
const getCategory = async (req, res) => {
  try {
    const category = await service.getCategory(req.query)
    return res.status(200).json(category)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const getCategoryId = async (req, res) => {
  try {
    const category = await service.findCategoryById({ _id: req.query._id })
    return res.status(200).json(category)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const updateCategoryId = async (req, res) => {
  try {
    const categoryId = await service.findCategoryById({ _id: req.body._id })
    if (!categoryId) {
      cloudinary.uploader.destroy(req.file?.filename)
      return res.status(403).json({ message: 'category not exist' })
    }
    const category = await service.updateAndCreateCategory({
      ...req.body,
      image: req.file.path,
      imageName: req.file?.filename
    })
    cloudinary.uploader.destroy(req.body?.imageName)
    return res.status(200).json(category)
  } catch (err) {
    cloudinary.uploader.destroy(req.file?.filename)
    res.status(500).json({ error: err.message })
  }
}
const deleteCategoryId = async (req, res) => {
  try {
    if (!req.query?.imageName) return res.status(403).json({ message: 'category image not exist' })
    const categoryId = await service.findCategoryById({ _id: req.query._id })
    if (!categoryId) {
      return res.status(403).json({ message: 'category not exist' })
    }
    await service.deleteCategoryId({ _id: req.query._id })
    cloudinary.api.delete_resources(req.query?.imageName)
    return res.status(200).json({
      message: 'delete success !'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  createCategory,
  getCategory,
  getCategoryId,
  updateCategoryId,
  deleteCategoryId
}
