const MongoClient = require('mongodb').MongoClient;

const ss = require('@ss');
const helper = require('@ss/helper');

class Mongo {
    constructor() {
        console.log('mongo constructor');
        this.userConnect = null;
        this.storyConnect = null;
    }

    async ready() {
        const dbMongo = ss.configs.dbMongo;
        const url = `mongodb://${dbMongo.url}:${dbMongo.port}`;

        try {
            this.userConnect = await MongoClient.connect(url, { useUnifiedTopology: true, ignoreUndefined: true });
            this.storyConnect = await MongoClient.connect(url, { useUnifiedTopology: true, ignoreUndefined: true });
        }
        catch (err) {
            helper.slack.sendMessage(err);
        }
    }
}

module.exports = new Mongo();