const MongoClient = require('mongodb').MongoClient;

const UserDao = require('../dao/UserDao');
const StoryDao = require('../dao/StoryDao');
const ResourceDao = require('../dao/ResourceDao');
const AdminDao = require('../dao/AdminDao');

const ss = require('@ss');
const helper = require('@ss/helper');

class Mongo {
    constructor() {
        console.log('mongo constructor');
        this.userConnect = null;
        this.storyConnect = null;
        
        this.daoStory = null;
        this.daoResource = null;
        this.daoAdmin = null;

        this.daoUser = null;
    }

    async ready() {
        const dbMongo = ss.configs.dbMongo;
        const url = `mongodb://${dbMongo.url}:${dbMongo.port}`;
        
        try {
            this.userConnect = await MongoClient.connect(url, { useUnifiedTopology: true });
            this.storyConnect = await MongoClient.connect(url, { useUnifiedTopology: true });
            
            this.daoStory = new StoryDao(this.storyConnect);
            this.daoResource = new ResourceDao(this.storyConnect);
            this.daoAdmin = new AdminDao(this.storyConnect);

            this.daoUser = new UserDao(this.userConnect);
        }
        catch (err) {
            helper.slack.sendMessage(err);
        }
    }
}

module.exports = new Mongo();