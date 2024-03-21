const PostsModel = require('../models/Posts.model')

exports.createPosts = async (data) => {
  return await PostsModel.create(data)
}
exports.getPosts = async (query) => {
  return await PostsModel.find(query)
}
exports.deletePostId = async (query) => {
  return await PostsModel.deleteOne({ _id: query._id })
}
exports.findPostsById = async (query) => {
  return await PostsModel.findOne({ _id: query._id }).exec()
}

exports.updateAndCreatePosts = async (query) => {
  return await PostsModel.findOneAndUpdate(
    {
      _id: query._id
    },
    {
      $set: {
        ...query
      }
    },
    { new: true }
  )
}
