function buildProfileObject(profile) {
    return {
        id: profile.getId(),
        full_name: profile.getName(),
        given_name: profile.getGivenName(),
        family_name: profile.getFamilyName(),
        image: profile.getImageUrl(),
        email: profile.getEmail()
    }
}

function onSignIn(googleUser) {
    const { id_token } = googleUser.getAuthResponse()
    const profile = googleUser.getBasicProfile()
    const builtProfile = buildProfileObject(profile)

    localStorage.setItem('google_profile', JSON.stringify(builtProfile))
    localStorage.setItem('google_id_token', id_token)
}

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut().then(() => {
        localStorage.removeItem('google_profile')
        localStorage.removeItem('google_id_token')
        window.location.href = '/'
    })
}