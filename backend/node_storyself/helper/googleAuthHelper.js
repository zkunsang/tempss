const ss = require('@ss');
const fetch = require('node-fetch');

class GoogleAuthHelper {
    constructor() {
        this.oAuth2Client = null;
        this.slackConfig = null;
    }

    async ready() {
        
        const { google } = require('googleapis');
        this.oAuth2Client = new google.auth.OAuth2(
            ss.configs.googleOAuth2.client_id,
            ss.configs.googleOAuth2.client_secret,
            ss.configs.googleOAuth2.redirect_url
        );

        const scopes = ['https://www.googleapis.com/auth/androidpublisher'];

        return;
        // let url = this.oAuth2Client.generateAuthUrl({
        //     access_type: 'offline',
        //     scope: scopes,
        //     approval_prompt: 'force'
        // });

        // const result = await fetch(url);
        // const jsonResult = await result.text();

        // console.log(jsonResult);
    }
}

module.exports = new GoogleAuthHelper();
