const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const { config } = require('./config')

const app = express()

// Body Parser
app.use(bodyParser.json())

app.post('/api/auth/token', ( req, res ) => {
    const { email, username, name } = req.body

    const token = jwt.sign({ sub: username, email, name }, config.authJwtSecret, {
        expiresIn: 700
    })

    res.json({ access_token: token })
})

app.post('/api/auth/verify', ( req, res, next ) => {
    const { access_token } = req.query

    try {
        const decoded = jwt.verify(access_token, config.authJwtSecret)

        res.json({
            message: "Valid access token.",
            username: decoded.sub
        })
    } catch (err) {
        next(err)
    }
})

let server = app.listen(5000, () => {
    console.log(`Listening at http://localhost:${server.address().port}`)
})
