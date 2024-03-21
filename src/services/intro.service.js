const IntroModel = require('../models/Intro.model')

exports.createIntro = async (data) => {
  return await IntroModel.create(data)
}
exports.getIntro = async (query) => {
  return await IntroModel.find(query)
}
exports.deleteIntroId = async (query) => {
  return await IntroModel.deleteOne({ _id: query._id })
}
exports.findIntroById = async (query) => {
  return await IntroModel.findOne({ _id: query._id }).exec()
}

exports.updateAndCreateIntro = async (query) => {
  return await IntroModel.findOneAndUpdate(
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
