'use strict'
const {
  createPosts,
  getPosts,
  findPostsById,
  updateAndCreatePosts,
  deletePostId
} = require('../services/post.service')

const createPostsController = async (req, res) => {
  try {
    const data = req.body
    const Posts = await createPosts(data)
    return res.status(200).json(Posts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const getPostsController = async (req, res) => {
  try {
    const Posts = await getPosts()
    return res.status(200).json(Posts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const getPostsId = async (req, res) => {
  try {
    const Posts = await findPostsById({ _id: req.query._id })
    return res.status(200).json(Posts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const updatePostsId = async (req, res) => {
  try {
    const PostsId = await findPostsById({ _id: req.body._id })
    if (!PostsId) {
      return res.status(403).json({ message: 'Posts not exist' })
    }
    const Posts = await updateAndCreatePosts({ ...req.body, _id: req.body._id })
    return res.status(200).json(Posts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
const deletePostsId = async (req, res) => {
  try {
    const PostsId = await findPostsById({ _id: req.query._id })
    if (!PostsId) {
      return res.status(403).json({ message: 'Posts not exist' })
    }
    await deletePostId({ _id: req.query._id })
    return res.status(200).json({
      message: 'delete success !'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  createPostsController,
  getPostsController,
  getPostsId,
  updatePostsId,
  deletePostsId
}
