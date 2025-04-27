'use strict'
const productService = require('../services/product.service')
const cloudinary = require('cloudinary').v2
const productController = async (req, res) => {
  try {
    const data = req.body
    let path = ''
    req.files.forEach((files) => (path = path + files.path + ','))
    const productId = await productService.findProductByName({ productName: req.body.productName })
    if (productId) {
      cloudinary.api.delete_resources(req.files.map((file) => file.filename))
      return res.status(403).json({ message: 'product exist' })
    }

    const product = await productService.createProduct({
      ...data,
      image: path.substring(0, path.lastIndexOf(',')),
      imageName: req.files.map((file) => file.filename),
      sizeDetail: JSON.parse(req.body.sizeDetail),
      tag: JSON.parse(req.body.tag)
    })
    res.status(200).json({ status: 'Success', data: product })
  } catch (err) {
    cloudinary.api.delete_resources(req.files.map((file) => file.filename))
    res.status(500).json({ error: err.message })
  }
}

const getProduct = async (req, res) => {
  try {
    console.log(req.query)
    const product = await productService.getProduct(req.query)
    return res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const getProductId = async (req, res) => {
  try {
    const product = await productService.findProductById({ _id: req.query._id })
    return res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
// const updateProductId = async (req, res) => {
//   try {
//     let path = ''
//     req.files.forEach((files) => (path = path + files.path + ','))
//     const productId = await productService.findProductById({ _id: req.body._id })
//     if (!productId) {
//       cloudinary.api.delete_resources((file) => file.filename)
//       return res.status(403).json({ message: 'product not exist' })
//     }
//     if (!path) {
//       const product = await productService.updateAndCreateProduct({
//         ...req.body,
//         _id: req.body._id,
//         image: productId.image,
//         imageName: productId.imageName
//       })
//       return res.status(200).json(product)
//     }
//     const product = await productService.updateAndCreateProduct({
//       ...req.body,
//       _id: req.body._id,
//       image: path.substring(0, path.lastIndexOf(',')),
//       imageName: req.files.map((file) => file.filename)
//     })
//     cloudinary.api.delete_resources(req.body?.imageName.split(','), (err, result) => {
//       console.log(err, result)
//     })
//     return res.status(200).json(product)
//   } catch (err) {
//     cloudinary.api.delete_resources(req.files.map((file) => file.filename))
//     res.status(500).json({ error: err.message })
//   }
// }
const updateProductId = async (req, res) => {
  try {
    // Ghép đường dẫn ảnh mới
    let path = req.files?.map(file => file.path).join(',') || '';

    // Tìm sản phẩm cần update
    const product = await productService.findProductById({ _id: req.body._id });
    if (!product) {
      return res.status(403).json({ message: 'Product not exist' });
    }

    // Nếu không có ảnh mới → giữ ảnh cũ
    const updatedProduct = await productService.updateAndCreateProduct({
      ...req.body,
      sizeDetail: JSON.parse(req.body.sizeDetail),
      image: path || product.image,
      imageName: req.files?.length > 0
        ? req.files.map(file => file.filename)
        : product.imageName
    });

    // Nếu có ảnh mới → xóa ảnh cũ trên cloudinary
    if (req.files?.length > 0 && req.body?.imageName) {
      cloudinary.api.delete_resources(req.body.imageName.split(','), (err, result) => {
        console.log('Cloudinary delete:', err, result);
      });
    }

    return res.status(200).json(updatedProduct);
  } catch (err) {
    // Nếu lỗi, xóa ảnh vừa upload (nếu có)
    if (req.files?.length > 0) {
      cloudinary.api.delete_resources(req.files.map(file => file.filename));
    }
    res.status(500).json({ error: err.message });
  }
};
const deleteProductId = async (req, res) => {
  try {
    if (!req.query?.imageName) return res.status(403).json({ message: 'product image not exist' })
    const productId = await productService.findProductById({ _id: req.query._id })
    if (!productId) {
      return res.status(403).json({ message: 'product not exist' })
    }
    await productService.deleteProductId({ _id: req.query._id })
    cloudinary.api.delete_resources(req.query?.imageName)
    return res.status(200).json({
      message: 'delete success !'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
module.exports = {
  productController,
  getProduct,
  getProductId,
  updateProductId,
  deleteProductId
}
