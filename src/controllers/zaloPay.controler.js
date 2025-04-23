/* eslint-disable indent */
'use strict'
const axios = require('axios').default // npm install axios
const CryptoJS = require('crypto-js') // npm install crypto-js
const moment = require('moment')
const UserShippingInfo = require('../models/OrderDetail.model')
const updateQuantityInProduct = require('../services/product.service').updateQuantityInProduct
// const paymentService = require('../../services/payment.service')
// const ProductModel = require('../../models/Product.model')

const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create'
}

const zalopayment = async (req, res) => {
    const embed_data = {
        redirecturl: 'http://localhost:3000/ordersystem'
    };
    const { inforShip, price, items } = req.body

    const orderDetails = [
        {
            ...inforShip,
            items: items
        }
    ]
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: 'user123',
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(orderDetails),
        embed_data: JSON.stringify(embed_data),
        amount: price,
        description: `Panda - Payment for the order #${transID}`,
        bank_code: 'zalopayapp',
        callback_url: 'https://a478-2405-4802-1cbf-b910-7101-e538-54c1-a2cb.ngrok-free.app/v1/api/orders/callback-zalopay',

    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + '|' + order.app_trans_id + '|' + order.app_user + '|' + order.amount + '|' + order.app_time + '|' + order.embed_data + '|' + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    axios.post(config.endpoint, null, { params: order })
        .then(_res => {
            res.status(200).json(_res.data)
        })
        .catch(err => console.log(err));
}

const callbackZalopayment = async (req, res) => {
    let result = {}
    try {
        let dataStr = req.body.data
        let reqMac = req.body.mac
        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString()
        if (reqMac !== mac) {
            result.return_code = -1
            result.return_message = 'mac not equal'
        } else {

            let data = JSON.parse(dataStr)?.item
            let dataItem = JSON.parse(data)?.[0]
            console.log(dataItem, 'dataItem');
            const cleanedItems = dataItem.items.map(item => ({
                id: item.id,
                idSize: item.idSize,
                idSizeDetail: item.idSizeDetail,
                totTalQuantity: item.totTalQuantity,
                quantity: item.quantity
            }));
            const newShipping = new UserShippingInfo({
                userId: dataItem.userId,
                name: dataItem.name,
                phone: dataItem.phone,
                address: dataItem.address,
                email: dataItem.email,
                note: dataItem.note,
                items: cleanedItems
            });
            await newShipping.save()
            for (const item of dataItem.items) {
                await updateQuantityInProduct(item);
            }

            result.return_code = 1
            result.return_message = 'success'
        }
    } catch (ex) {
        console.log('lỗi:::' + ex.message)
        result.return_code = 0 // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message
    }
    res.json(result)
}

const refundZalopay = async (reg, res) => {
    const config = {
        appid: '2553',
        key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
        key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
        endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/partialrefund'
    }

    const timestamp = Date.now()
    const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}` // unique id

    let params = {
        appid: config.appid,
        mrefundid: `${moment().format('YYMMDD')}_${config.appid}_${uid}`,
        timestamp, // miliseconds
        zptransid: 240913000002388,
        amount: 3000000,
        description: 'ZaloPay Refund Demo'
    }

    // appid|zptransid|amount|description|timestamp
    let data =
        params.appid +
        '|' +
        params.zptransid +
        '|' +
        params.amount +
        '|' +
        params.description +
        '|' +
        params.timestamp
    params.mac = CryptoJS.HmacSHA256(data, config.key1).toString()

    axios
        .post(config.endpoint, null, { params })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err))
}
const checkStatusRefund = (req, res) => {
    const config = {
        appid: '2553',
        key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
        key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
        endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/getpartialrefundstatus'
    }

    const params = {
        appid: config.appid,
        timestamp: Date.now(), // miliseconds
        mrefundid: 240913000000258
    }

    const data = config.appid + '|' + params.mrefundid + '|' + params.timestamp // appid|mrefundid|timestamp
    params.mac = CryptoJS.HmacSHA256(data, config.key1).toString()

    axios
        .get(config.endpoint, { params })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err))
}
const paymentHome = async (req, res) => {
    const data = req?.body
    const reduceQuantity = (quanity, color, valueToUpdate) => {
        // Duyệt qua từng object trong mảng
        return quanity.map((item) => {
            if (item[color.toString()]) {
                console.log(color, 'color')
                console.log(valueToUpdate, 'valueToUpdate')

                // Cập nhật giá trị của color
                return {
                    ...item,
                    [color]: valueToUpdate || 0
                }
            }
            return item
        })
    }
    // const updateProductVersions = async (items) => {
    //     try {
    //         const updatePromises = items.map(async (item) => {
    //             const product = await ProductModel.findOne({ _id: item?.id }).exec()

    //             if (!product) {
    //                 throw new Error(`Product not found for id: ${item.id}`)
    //             }

    //             const versionToUpdate = product.version.find(
    //                 (version) => version._id.toString() === item.id_version
    //             )

    //             if (!versionToUpdate) {
    //                 throw new Error(`Version not found for id_version: ${item.id_version}`)
    //             }

    //             const colorToUpdate = versionToUpdate.quannity.find((q) => q[item.keyColor] !== undefined)

    //             if (colorToUpdate) {
    //                 const newQuantity = colorToUpdate[item.keyColor] - item.quantity

    //                 if (newQuantity < 0) {
    //                     throw new Error(`Insufficient quantity for color: ${item.keyColor}`)
    //                 }

    //                 colorToUpdate[item.keyColor] = newQuantity
    //             }
    //             product.quannityTotal = product.quannityTotal - item?.quantity

    //             product.version = product.version.map((v) =>
    //                 v._id.toString() === item?.id_version
    //                     ? {
    //                         ...v,
    //                         quannity: reduceQuantity(
    //                             v.quannity,
    //                             item?.keyColor,
    //                             Object.values(colorToUpdate)[0].toString()
    //                         )
    //                     }
    //                     : v
    //             )
    //             console.log(product.version)

    //             // Lưu cập nhật vào cơ sở dữ liệu
    //             await product.save()
    //         })

    //         // Đợi tất cả các promise hoàn thành
    //         await Promise.all(updatePromises)
    //         console.log('All product versions updated successfully')
    //     } catch (error) {
    //         console.error('Error updating product versions:', error.message)
    //     }
    // }
    // const item = JSON.parse(data?.item)
    // const infor = JSON.parse(data?.informationShip)
    // console.log(item, 'item')
    // try {
    //     const data = await updateProductVersions(item)
    // } catch (error) {
    //     console.log(error.message)
    // }
    // const body = {
    //     method: data?.method,
    //     amount: data.amount,
    //     item: item,
    //     nameCusstormer: infor?.name,
    //     status: 1,
    //     userId: infor?.userId,
    //     informationShip: {
    //         phone: infor.phone,
    //         province: infor.province,
    //         recipientName: infor.recipientName,
    //         note: infor.note,
    //         district: infor.district,
    //         ward: infor.ward,
    //         addressStore: infor.addressStore,
    //         address: infor.address
    //     }
    // }
    // try {
    //     await paymentService.createPayment(body)
    //     return res.status(200).json({
    //         message: 'Tạo đơn hàng thành công'
    //     })
    // } catch (error) {
    //     console.log(error, 'looi')
    // }
}
module.exports = {
    zalopayment,
    callbackZalopayment,
    paymentHome,
    refundZalopay,
    checkStatusRefund
}