const db = require('../db')

const getUsers = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, email, last_login, last_activity, status, created_at 
       FROM users 
       WHERE status != 'deleted' 
       ORDER BY last_login DESC NULLS LAST`,
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

const updateUserStatus = async (req, res) => {
  const { userIds, status } = req.body

  try {
    const { rows } = await db.query(
      `UPDATE users 
       SET status = $1, 
           last_activity = CURRENT_TIMESTAMP 
       WHERE id = ANY($2) 
       RETURNING id, status`,
      [status, userIds],
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

const deleteUsers = async (req, res) => {
  const { userIds } = req.body

  try {
    const { rows } = await db.query(
      `UPDATE users 
       SET status = 'deleted', 
           last_activity = CURRENT_TIMESTAMP 
       WHERE id = ANY($1) 
       RETURNING id`,
      [userIds],
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getUsers,
  updateUserStatus,
  deleteUsers,
}
