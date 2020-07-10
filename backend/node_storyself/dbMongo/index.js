const MongoClient = require('mongodb').MongoClient;
const ss = require('@ss');

class Mongo {
    constructor() {
        this.mongoConnect = null;
        this.dbStory = null;
        this.collectionUser = null;
        this.collectionData = null;
    }

    async ready() {
        const dbMongo = ss.configs.dbMongo;
        const url = `mongodb://${dbMongo.url}:${dbMongo.port}/testdb`;

        try {
            this.mongoConnect = await MongoClient.connect(url, { useUnifiedTopology: true })
            
            this.dbStory = await this.mongoConnect.db('story');
            this.collectionUser = await this.dbStory.collection('user');
            this.collectionData = await this.dbStory.collection('data');
            this.collectionResource = await this.dbStory.collection('resource');
        }
        catch (err) {
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

    async getStoryList() {
        return await this.collectionData.find().toArray();
    }

    async getStoryInfo(storyId) {
        return await this.collectionData.findOne({ storyId });
    }

    async updateStory(findQuery, updateQuery) {
        return await this.collectionData.updateOne(findQuery, {$set: updateQuery});
    }

    async createStory(insertQuery) {
        return await this.collectionData.insertOne(insertQuery);
    }

    async getStoryResource(storyId) {
        return await this.collectionResource.find({ storyId }).toArray();
    }

    async insertStoryResource(resourceData) {
        return await this.collectionResource.insertOne(resourceData);
    }

    async updateStoryResource(resourceData) {
        const findQuery = { resourceId: resourceData.resourceId };
        return await this.collectionResource.updateOne(findQuery, resourceData);
    }

}

module.exports = new Mongo();

