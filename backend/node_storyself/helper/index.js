const slackHelper = require('./slackHelper');
const fluentHelper = require('./fluentHelper');

class Helper {
    constructor() {
        this.slack = slackHelper;
        this.fluent = fluentHelper; 
    }

    async ready() {
        await this.slack.ready();
        await this.fluent.ready();
    }
};

module.exports = new Helper();