const CategoryModel = require('../models/Category.model')

exports.updateAndCreateCategory = async (category) => {
  return await CategoryModel.findOneAndUpdate(
    {
      _id: category._id
    },
    {
      $set: {
        ...category
      }
    },
    { new: true }
  )
}

exports.getCategory = async (query) => {
  return await CategoryModel.paginate(query)
  // return await CategoryModel.find({}).sort({ createdAt: -1 })
}
exports.createCategory = async (data) => {
  return await CategoryModel.create(data)
}
exports.deleteCategoryId = async (query) => {
  return await CategoryModel.deleteOne({ _id: query._id })
}
exports.findCategoryByName = async (query) => {
  return await CategoryModel.findOne({ name: query.name }).exec()
}
exports.findCategoryById = async (query) => {
  return await CategoryModel.findOne({ _id: query._id }).exec()
}
