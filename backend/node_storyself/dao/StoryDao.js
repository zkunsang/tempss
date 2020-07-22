const Story = require("../models/mongo/story");

class StoryDao {
    constructor(connection) {
        this.db = connection.db('story');
        this.collection = this.db.collection('story');
    }

    async insert(story) {
        story.insertValid();
        const result = await this.collection.insertOne(story);
    }

    async insertMany(storyList) {
        for(const story of storyList) {
            story.insertValid();
        }
        
        const result = await this.collection.insertMany(storyList);
    }

    async update(where, $set) {
        const result = await this.collection.updateOne(where, {$set});
    }

    async getList(where) {
        const result = await this.collection.find().toArray();
        return result;
    }

    async getOne(where) {
        const result = await this.collection.find(where).toArray();
        throw new Error('test Error');
        if(result.length > 1) {
            
        }
        return result;
    }

    async delete(where) {
        const result = await this.collection.deleteOne(where);
    }

    async deleteAll() {
        const result = await this.collection.deleteMany();
    }
}

module.exports = StoryDao;