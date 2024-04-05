'use strict'
const paginate = (schema) => {
  schema.static('paginate', function (query) {
    const { limit, offset, ...rest } = query
    if (!limit || parseInt(limit) < 0) {
      const obj = { ...rest }
      if (!limit && Object.keys(obj).length > 0) {
        const filter = {}
        for (let key in obj) {
          if (key === 'price') {
            filter['price'] = query.price = {
              $gte: obj.minPrice ? parseFloat(obj.minPrice) : 0,
              $lte: obj.maxPrice ? parseFloat(obj.maxPrice) : 10000000
            }
          } else if (!key.includes('id')) {
            filter[key] = { $regex: obj[key], $options: 'i' }
          } else {
            filter[key] = obj[key]
          }
        }
        const countPromise = this.countDocuments(filter).exec()
        const docsPromise = this.find(filter).skip(parseInt(offset)).sort({
          createdAt: -1
        })
        return Promise.all([countPromise, docsPromise]).then((values) => {
          const [totalCount, data] = values
          return Promise.resolve({
            data,
            totalCount
          })
        })
      }
      const countPromise = this.countDocuments({}).exec()
      const docsPromise = this.find({}).sort({
        createdAt: -1
      })
      return Promise.all([countPromise, docsPromise]).then((values) => {
        const [totalCount, data] = values
        return Promise.resolve({
          data,
          totalCount
        })
      })
    }
    const obj = { ...rest }
    const filter = {}
    for (let key in obj) {
      if (key === 'price') {
        filter['price'] = query.price = {
          $gte: obj.minPrice ? parseFloat(obj.minPrice) : 0,
          $lte: obj.maxPrice ? parseFloat(obj.maxPrice) : 10000000
        }
      } else if (!key.includes('id')) {
        filter[key] = { $regex: obj[key], $options: 'i' }
      } else {
        filter[key] = obj[key]
      }
    }
    const countPromise = this.countDocuments(filter).exec()
    const docsPromise = this.find(filter).skip(parseInt(offset)).limit(parseInt(limit)).sort({
      createdAt: -1
    })
    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalCount, data] = values
      return Promise.resolve({
        data,
        totalCount
      })
    })
  })
}

module.exports = { paginate }
