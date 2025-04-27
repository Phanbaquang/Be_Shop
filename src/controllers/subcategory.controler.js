/* eslint-disable indent */
/* eslint-disable comma-dangle */
'use strict'
const service = require('../services/subCategory.service')
const cloudinary = require('cloudinary').v2

const createSubCategory = async (req, res) => {
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
const getSubCategory = async (req, res) => {
    try {
        const category = await service.getCategory(req.query)
        return res.status(200).json(category)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
const getSubCategoryId = async (req, res) => {
    try {
        const category = await service.findCategoryById({ _id: req.query._id })
        return res.status(200).json(category)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
const updateSubCategoryId = async (req, res) => {
    try {
        // Kiểm tra xem category có tồn tại không
        const categoryId = await service.findCategoryById({ _id: req.body._id });
        if (!categoryId) {
            // Nếu không tồn tại, xóa ảnh (nếu có)
            if (req.file) {
                cloudinary.uploader.destroy(req.file?.filename);
            }
            return res.status(403).json({ message: 'Category does not exist' });
        }

        // Xử lý cập nhật category
        let updatedData = {
            ...req.body,
        };

        // Nếu có ảnh mới, lưu ảnh vào database
        if (req.file) {
            updatedData.image = req.file.path;
            updatedData.imageName = req.file.filename;

            // Xóa ảnh cũ trên cloudinary nếu có
            if (req.body.imageName) {
                await cloudinary.uploader.destroy(req.body.imageName);
            }
        }

        // Cập nhật category
        const category = await service.updateAndCreateCategory(updatedData);

        return res.status(200).json(category);
    } catch (err) {
        // Xóa ảnh nếu có lỗi
        if (req.file) {
            cloudinary.uploader.destroy(req.file?.filename);
        }
        res.status(500).json({ error: err.message });
    }
};
const deleteSubCategoryId = async (req, res) => {
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
    createSubCategory,
    getSubCategory,
    getSubCategoryId,
    updateSubCategoryId,
    deleteSubCategoryId
}
