const Resource = require("../models/mongo/resource");

class ResourceDao {
    constructor(connection) {
        this.db = connection.db('story');
        this.collection = this.db.collection('resource');
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

module.exports = ResourceDao;