const ProductModel = require('../models/Product.model')

exports.createProduct = async (data) => {
  return await ProductModel.create(data)
}
exports.getProduct = async ({ minPrice, maxPrice, categoryId }) => {
  let query = {}

  if (minPrice !== undefined && maxPrice !== undefined) {
    query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
  }
  if (categoryId !== undefined) {
    query.category = categoryId
  }
  return await ProductModel.find(query).sort({ createdAt: -1 })
}
exports.findProductByName = async (query) => {
  return await ProductModel.findOne({ productName: query.productName }).exec()
}
exports.findProductById = async (query) => {
  return await ProductModel.findOne({ _id: query._id }).exec()
}
exports.updateAndCreateProduct = async (product) => {
  return await ProductModel.findOneAndUpdate(
    {
      _id: product._id
    },
    {
      $set: {
        ...product
      }
    },
    { new: true }
  )
}
exports.deleteProductId = async (query) => {
  return await ProductModel.deleteOne({ _id: query._id })
}
