const Story = require("../models/mongo/story");

class StoryDao {
    constructor(connection) {
        this.db = connection.db('story');
        this.collection = this.db.collection('story');
    }

    async insert(user) {
        user.insertValid();
        await this.collection.insert(user);
    }

    async update(where, $set) {
        await this.collection.updateOne(where, {$set});
    }

    async getList() {
        const result = await this.collection.find().toArray();
        return result;
    }

    async getOne() {
        const result = await this.collection.find().toArray();
        return result;
    }
}

module.exports = StoryDao;