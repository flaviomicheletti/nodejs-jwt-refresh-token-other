const dotenv = require('dotenv')
const express = require('express')
const jwt = require('jsonwebtoken')

dotenv.config()
const app = express()

app.use(express.json())

const posts = [
  { username: 'Kyle', title: 'Post 1' },
  { username: 'Jim', title: 'Post 2' }
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts)
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

const port = process.env.PORT;
app.listen(port)
console.log('Server listening on port ' + port);