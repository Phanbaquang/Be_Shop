const FooterModel = require('../models/Footer.model')

exports.createFooter = async (data) => {
  return await FooterModel.create(data)
}
exports.getFooter = async (query) => {
  return await FooterModel.find(query)
}

exports.updateAndCreateFooter = async (footer) => {
  return await FooterModel.findOneAndUpdate(
    {
      _id: footer._id
    },
    {
      $set: {
        ...footer
      }
    },
    { new: true }
  )
}
