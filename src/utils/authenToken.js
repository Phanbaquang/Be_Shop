const jwt = require('jsonwebtoken')

function authenToken(req, res, next) {
  try {
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader)
      return res.status(401).json({
        message: 'not authorization'
      })
    const token = authorizationHeader.split(' ')[1]
    if (!token)
      return res.status(401).json({
        message: 'not authorization'
      })
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err)
        return res.status(401).json({
          message: 'forbidan'
        })
      next()
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  authenToken
}
