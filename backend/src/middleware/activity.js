const db = require('../db')

const trackActivity = async (req, res, next) => {
  try {
    if (req.user) {
      await db.query(
        'UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE id = $1',
        [req.user.id],
      )
    }
    next()
  } catch (error) {
    next()
  }
}

module.exports = trackActivity
