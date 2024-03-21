'use strict'
const service = require('../services/service')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const cloudinary = require('cloudinary').v2
dotenv.config()

const createUserController = async (req, res) => {
  try {
    const { mail } = req.body
    const user = await service.findUserByEmail({ mail })
    if (user) {
      return res.status(500).json({ message: 'user exist' })
    }
    const blog = await service.createUser(req.body)
    return res.json({ data: blog, status: 'success' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const getUserId = async (req, res) => {
  try {
    const category = await service.findUserById({ _id: req.query._id })
    return res.status(200).json(category)
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
const LoginController = async (req, res) => {
  try {
    const data = req.body
    const user = await service.findUserByEmail({ mail: data.mail })
    if (!user) {
      return res.status(500).json({ message: 'email and phone not exist' })
    }
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '8h'
    })
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' })
    const authToken = await service.createToken({
      accessToken,
      refreshToken,
      user: user._id,
      mail: data.mail,
      password: data.password
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
      return res.status(401).json('ko co uy quyen ')
    }
    const user = await service.findUserByEmail({ mail: data.mail })
    if (!user) {
      return res.status(500).json({ message: 'email and phone not exist' })
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
      if (err) {
        return res.status(401).json('refresh token ko hop le ')
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
  getUserId
}
