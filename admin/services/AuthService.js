import auth0 from 'auth0-js'
import scopesArray from '../utils/scopesArray'

export default class AuthService {
    auth0 = new auth0.WebAuth({
        domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
        clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
        audience: process.env.NEXT_PUBLIC_AUTH0_API_AUDIENCE,
        redirectUri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
        responseType: 'token id_token',
        scope: scopesArray.join(' ')
    })

    login = () => {
        this.auth0.authorize()
    }

    logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('id_token')
        localStorage.removeItem('expires_at')
        localStorage.removeItem('profile')
    }

    handleAuthentication = () => {
        return new Promise(( resolve, reject ) => {
            this.auth0.parseHash(function (error, authResult) {
                if (error) {
                    console.error('Error parsing hash')
                    return reject(error)
                }

                if (authResult && authResult.accessToken && authResult.idToken) {
                    this.setSession(authResult)
                    return resolve(authResult.accessToken)
                }
            }.bind(this))
        }).then(access_token => {
            console.log(access_token)
            return this.handleUserInfo(access_token)
        })
    }

    setSession = (authResult) => {
        const expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        )

        localStorage.setItem('access_token', authResult.accessToken)
        localStorage.setItem('id_token', authResult.idToken)
        localStorage.setItem('expires_at', expiresAt)
    }

    isAuthenticated = () => {
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
        return new Date().getTime() < expiresAt
    }

    handleUserInfo = (accessToken) => {

        return new Promise((reject, resolve) => {
            this.auth0.client.userInfo(accessToken, (error, profile) => {
                if (error) {
                    console.error('Error getting user info')
                    return reject(error)
                }

                if (profile) {
                    this.setProfile(profile)
                    return resolve(profile)
                }
            })
        })
    }

    setProfile = (profile) => {
        localStorage.setItem('profile', JSON.stringify(profile))
    }

    getProfile = () => {
        const profile = localStorage.getItem('profile')
        return profile ? JSON.parse(profile) : {}
    }
}