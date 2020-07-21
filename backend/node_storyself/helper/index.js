const slackHelper = require('./slackHelper');

class Helper {
    constructor() {
        this.slack = slackHelper;
    }

    async ready() {
        await this.slack.ready();
    }
};

module.exports = new Helper();