const dotenv = require('dotenv')
const express = require('express')
const jwt = require('jsonwebtoken')

dotenv.config()
const app = express()

app.use(express.json())

//
// gravado na memória apenas para simplificar o tutorial
//
const refreshTokens = []

// Authenticate User
app.post('/login', (req, res) => {
  const user = { name: req.body.username }

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ accessToken, refreshToken })
})

app.post('/refresh-token', (req, res) => {
  const tokenWithBearer = req.header('Authorization');
  const refreshToken = tokenWithBearer.replace("Bearer ", "").toString();

  if (refreshToken == null) return res.sendStatus(401)

  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
    res.json({ accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

const port = process.env.PORT;
app.listen(port)
console.log('Server listening on port ' + port);