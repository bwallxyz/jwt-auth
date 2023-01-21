require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())

const posts = [
    {
        username: 'name1',
        title: 'title1'
    },  {
        username: 'name2',
        title: 'title2'
    }
]

const PORT = 3081

app.listen(PORT, () => {
    console.log(`Listening on port:${PORT}`)
})

app.get('/posts', authenticateToken, (req,res) => {
    console.log(req.user.username)
    res.json(posts.filter(post => post.username === req.user.username))
})

app.post('/login', (req, res) => {
    //Authenticate User
    const username = req.body.username
    const user = {username}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken})

})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.SendStatus(403)
        req.user = user
        console.log(user)
        next()
    })
}