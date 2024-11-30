const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const { rows } = await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name],
    )

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET)
    res.status(201).json({ user: rows[0], token })
  } catch (error) {
    if (error.constraint === 'users_email_idx') {
      return res.status(400).json({ error: 'Email already in use' })
    }
    res.status(500).json({ error: 'Server error' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const { rows } = await db.query(
      'SELECT * FROM users WHERE email = $1 AND status != $2',
      [email, 'deleted'],
    )

    if (!rows[0] || rows[0].status === 'blocked') {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, rows[0].password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [rows[0].id],
    )

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET)
    res.json({ user: rows[0], token })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { register, login }
