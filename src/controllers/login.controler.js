'use strict'
const service = require('../services/service')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const cloudinary = require('cloudinary').v2
const bcrypt = require('bcrypt')
const saltRounds = 10
dotenv.config()

const createUserController = async (req, res) => {
  try {
    const { mail, phone, password } = req.body
    const user = await service.findUserByEmail({ mail })
    const phoneSearch = await service.findUserByPhone({ phone })
    if (user || phoneSearch) {
      cloudinary.uploader.destroy(req.file?.filename)
      return res.status(500).json({ message: 'Tài khoản đã tồn tại' })
    }
    const hash = await bcrypt.hash(password, saltRounds)

    const response = await service.createUser({
      ...req.body,
      password: hash,
      image: req?.file?.path ?? '',
      imageName: req?.file?.filename ?? []
    })
    return res.json({ data: response, status: 'success' })
  } catch (err) {
    cloudinary.uploader.destroy(req.file?.filename)
    res.status(500).json({ error: err.message })
  }
}
const getUser = async (req, res) => {
  try {
    const response = await service.getUserAll(req.query)
    return res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const getUserByMonthControler = async (req, res) => {
  try {
    const response = await service.getUserByMonth(req.query)
    const monthsArray = Array.from({ length: 12 }, (_, i) => i + 1)

    const finalResult = monthsArray.map((month) => {
      const foundMonth = response.find((item) => item.month === month)
      return {
        month: month,
        count: foundMonth ? foundMonth.count : 0
      }
    })
    return res.status(200).json(finalResult)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const getUserId = async (req, res) => {
  try {
    const response = await service.findUserById({ _id: req.query._id })
    return res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateUserId = async (req, res) => {
  try {
    const UserId = await service.findUserById({ _id: req.body._id })
    if (!UserId) {
      cloudinary.uploader.destroy(req.file?.filename)
      return res.status(403).json({ message: 'user not exist' })
    }
    if (!req?.file?.path) {
      const User = await service.updateAndCreateUser({
        ...req.body,
        image: UserId.image,
        imageName: UserId.imageName
      })
      return res.status(200).json(User)
    }
    const User = await service.updateAndCreateUser({
      ...req.body,
      image: req.file.path,
      imageName: req.file?.filename
    })
    cloudinary.uploader.destroy(req.body?.imageName)
    return res.status(200).json(User)
  } catch (err) {
    cloudinary.uploader.destroy(req.file?.filename)
    res.status(500).json({ error: err.message })
  }
}
const deleteUserId = async (req, res) => {
  try {
    if (!req.query?.imageName) return res.status(403).json({ message: 'user image not exist' })
    const data = await service.findUserById({ _id: req.query._id })
    if (!data) {
      return res.status(403).json({ message: 'user not exist' })
    }
    await service.deleteUserId({ _id: req.query._id })
    cloudinary.api.delete_resources(req.query?.imageName)
    return res.status(200).json({
      message: 'delete success !'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const LoginController = async (req, res) => {
  try {
    const data = req.body
    const user = await service.findUserByEmail({ mail: data.mail })
    if (!user) {
      return res.status(500).json({ message: 'Tài khoản không tồn tại' })
    }
    const byHash = await bcrypt.compare(req.body.password, user.password)
    if (!byHash) {
      return res.status(500).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' })
    }
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '8h'
    })
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' })
    const authToken = await service.createToken({
      accessToken,
      refreshToken,
      user: user._id,
      role: user.role,
      mail: user.mail,
      password: user.password
    })
    if (!authToken) {
      return res.status(500).json({ message: 'login failed' })
    }
    return res.status(200).json(authToken)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const refreshTokenController = async (req, res) => {
  try {
    const data = req.body
    const refreshToken = req.body.token
    if (!refreshToken) {
      return res.status(401).json('Không có ủy quyền')
    }
    const user = await service.findUserByEmail({ mail: data.mail })
    if (!user) {
      return res.status(500).json({ message: 'email and phone không tồn tại' })
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
      if (err) {
        return res.status(401).json('refresh token không hợp lệ')
      }
      const accessToken = jwt.sign(
        { mail: data.mail, password: data.password },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '8h'
        }
      )
      const updateAccessToken = await service.updateAccessToken({ accessToken, mail: data.mail })
      return res.status(200).json(updateAccessToken)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  createUserController,
  LoginController,
  refreshTokenController,
  updateUserId,
  getUserId,
  getUser,
  deleteUserId,
  getUserByMonthControler
}
