const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const auth = require('./middleware/auth')
const trackActivity = require('./middleware/activity')

const app = express()

app.use(cors())
app.use(express.json())

// Public routes
app.use('/api/auth', authRouter)

// Protected routes
app.use(auth, trackActivity)
app.use('/api/users', usersRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
