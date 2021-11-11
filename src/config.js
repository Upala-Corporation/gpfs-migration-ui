module.exports = {
    "apiURL": process.env.REACT_APP_API_BASE_URL || "http://migration-tool.upala.com",
    "baseURL": process.env.REACT_APP_BASE_URL || "https://localhost",
    "oauthURL": process.env.REACT_APP_OAUTH_URL || "https://login.microsoftonline.com/0efe22c8-93ba-4c08-99cc-711c2bf4ad9b",
    "oauthRedirectURI": process.env.REACT_APP_OAUTH_REDIRECT_URI || "https://localhost/code",
    "oauthClientId": process.env.REACT_APP_OAUTH_CLIENT_ID || "e494ef3d-846c-48c7-96a9-2b37b6992fbc",
}
