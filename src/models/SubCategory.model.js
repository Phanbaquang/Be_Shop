/* eslint-disable indent */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { paginate } = require('./plugins/pagnigate')

const categorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        description: { type: String },
        imageName: { type: Array, default: [] },
        categoryId: { type: String, required: true },
    },
    {
        timestamps: true
    }
)
categorySchema.plugin(paginate)

module.exports = mongoose.model('SubCategory', categorySchema)
