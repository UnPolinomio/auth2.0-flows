const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const request = require('request')

const encodeBasic = require('./utils/encodeBasic')

const { config } = require('./config')

const app = express()


function getUserPlaylists(accessToken, userId) {
  if (!accessToken || !userId) {
    return Promise.resolve(null);
  }

  const options = {
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true
  };

  return new Promise((resolve, reject) => {
    request.get(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error);
      }

      resolve(body);
    });
  });
}


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



app.get('/api/playlists', async function(req, res, next) {
    const { userId } = req.query

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: `Basic ${encodeBasic(config.spotifyClientId, config.spotidyClientSecret)}`
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true,
    }

    request.post(authOptions, async function(error, response, body) {
        if (error || response.statusCode !==200) {
            next(error)
        }

        const { access_token: token } = body
        const userPlaylists = await getUserPlaylists(token, userId)
        
        res.json({ playlists: userPlaylists })
    })
})

let server = app.listen(5000, () => {
    console.log(`Listening at http://localhost:${server.address().port}`)
})
