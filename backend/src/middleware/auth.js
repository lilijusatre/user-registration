const jwt = require('jsonwebtoken')
const db = require('../db')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) throw new Error()

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { rows } = await db.query(
      'SELECT * FROM users WHERE id = $1 AND status != $2',
      [decoded.id, 'deleted'],
    )

    if (!rows[0] || rows[0].status === 'blocked') {
      return res.status(401).json({ error: 'Please authenticate' })
    }

    req.user = rows[0]
    req.token = token
    next()
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' })
  }
}

module.exports = auth
