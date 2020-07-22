const DaoWrapper = require('./daoWrapper');

class Wrapper {
    constructor() {
        this.userConnect = null;
        this.storyConnect = null;
    }

    async ready() {
        try {
            new DaoWrapper().init();
        }
        catch (err) {
            helper.slack.sendMessage(err);
        }
    }
}

module.exports = new Wrapper();