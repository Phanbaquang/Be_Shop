const ProductModel = require('../models/Product.model')
const mongoose = require('mongoose');
exports.createProduct = async (data) => {
  return await ProductModel.create(data)
}
exports.getProduct = async (query) => {
  // let query = {}

  // if (minPrice !== undefined && maxPrice !== undefined) {
  //   query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
  // }
  // if (categoryId !== undefined && categoryId) {
  //   query.category_id = categoryId
  // }
  // return await ProductModel.find(query).sort({ createdAt: -1 })
  return await ProductModel.paginate(query)
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

exports.updateQuantityInProduct = async (item) => {
  const productId = new mongoose.Types.ObjectId(item.id);  // Đảm bảo dùng new
  const sizeDetailId = new mongoose.Types.ObjectId(item.idSize);  // Đảm bảo dùng new
  const sizeId = new mongoose.Types.ObjectId(item.idSizeDetail);  // Đảm bảo dùng new
  const quantityToSubtract = item.quantity; // Số lượng cần trừ đi

  // Cập nhật số lượng trong sản phẩm
  await ProductModel.updateOne(
    {
      _id: productId,
      'sizeDetail._id': sizeDetailId,
      'sizeDetail.size._id': sizeId
    },
    {
      $inc: {
        'sizeDetail.$[outer].size.$[inner].quantity': -quantityToSubtract // Trừ số lượng
      }
    },
    {
      arrayFilters: [
        { 'outer._id': sizeDetailId }, // Lọc theo sizeDetail
        { 'inner._id': sizeId } // Lọc theo size trong sizeDetail
      ]
    }
  );
};