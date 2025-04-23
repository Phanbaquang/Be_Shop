/* eslint-disable indent */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    idSize: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    idSizeDetail: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    totTalQuantity: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { _id: false })

const userShippingInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    note: {
        type: String,
        default: ''
    },
    items: {
        type: [itemSchema],
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('OrderDetail', userShippingInfoSchema)