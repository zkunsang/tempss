const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://192.168.127.129:57017/testdb";

class Mongo {
    constructor() {
        console.log('constructor');
        this.mongoConnect = null;
        this.dbStory = null;
        this.collectionUser = null;
        this.collectionData = null;
    }
    
    async ready() {
        console.log('ready');

        try {
            this.mongoConnect = await MongoClient.connect(url, { useUnifiedTopology: true })
            this.dbStory = await this.mongoConnect.db('story');
            this.collectionUser = await this.dbStory.collection('user');
            this.collectionData = await this.dbStory.collection('data');
        } 
        catch(err) {
            console.error(err);
        }
    }

    async findUser(findQuery) {
        return await this.collectionUser.findOne(findQuery);
    }

    async updateUser(findQuery, updateQuery) {
        return await this.collectionUser.updateOne(findQuery, updateQuery);
    }

    async createUser(insertQuery) {
        return await this.collectionUser.insertOne(insertQuery);
    }

    async findStory(findQuery) {
        return await this.collectionData.findOne(findQuery);
    }

    async updateStory(findQuery, updateQuery) {
        return await this.collectionData.updateOne(findQuery, updateQuery);
    }

    async createStory(insertQuery) {
        return await this.collectionData.insertOne(insertQuery);
    }

}

module.exports = new Mongo();

