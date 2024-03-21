const ContactModel = require('../models/Contact.model')

exports.createContact = async (data) => {
  return await ContactModel.create(data)
}
exports.getContact = async (query) => {
  return await ContactModel.find(query)
}

exports.updateAndCreateContact = async (contact) => {
  return await ContactModel.findOneAndUpdate(
    {
      _id: contact._id
    },
    {
      $set: {
        ...contact
      }
    },
    { new: true }
  )
}
