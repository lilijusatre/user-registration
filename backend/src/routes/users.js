const express = require('express')
const {
  getUsers,
  updateUserStatus,
  deleteUsers,
} = require('../controllers/users')

const router = express.Router()

router.get('/', getUsers)
router.post('/status', updateUserStatus)
router.post('/delete', deleteUsers)

module.exports = router
