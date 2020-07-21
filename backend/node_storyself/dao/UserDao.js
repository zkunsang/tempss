const User = require("../models/mongo/user");

class UserDao {
    constructor(connection) {
        this.db = connection.db('user');
        this.collection = this.db.collection('user');
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

module.exports = UserDao;