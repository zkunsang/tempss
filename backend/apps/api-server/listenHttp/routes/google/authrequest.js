const ss = require('@ss');
const fetch = require('node-fetch');

module.exports = async (ctx, next) => {
    const { google } = require('googleapis');
    const oAuth2Client = new google.auth.OAuth2(
        ss.configs.googleOAuth2.client_id,
        ss.configs.googleOAuth2.client_secret,
        ss.configs.googleOAuth2.redirect_url
    );

    const scopes = ['https://www.googleapis.com/auth/androidpublisher'];


    let url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        approval_prompt: 'force'
    });

    ctx.redirect(url);
    await next();
}