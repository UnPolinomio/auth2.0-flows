require('dotenv').config()

const config = {
    authJwtSecret: process.env.AUTH_JWT_SECRET,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotidyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
}

module.exports = {
    config
}