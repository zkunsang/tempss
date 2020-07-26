const Admin = require("../models/mongo/admin");

class AdminDao {
    constructor(connection) {
        this.db = connection.db('story');
        this.collection = this.db.collection('resource');
    }

    async insert(admin) {
        admin.insertValid();
        await this.collection.insertOne(admin);
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

module.exports = AdminDao;