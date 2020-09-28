const slackHelper = require('./slackHelper');
const fluentHelper = require('./fluentHelper');
const googleAuthHelper = require('./googleAuthHelper');

class Helper {
    constructor() {
        this.slack = slackHelper;
        this.fluent = fluentHelper; 
        this.googleAuth = googleAuthHelper; 
    }

    async ready() {
        await this.slack.ready();
        await this.fluent.ready();
        await this.googleAuth.ready();
    }
};

module.exports = new Helper();