const User = require("../models/mongo/user");

class UserDao {
    constructor(connection) {
        this.db = connection.db('user');
        this.collection = this.db.collection('user');
    }

    async insert(user) {
        user.insertValid();
        await this.collection.insertOne(user);
    }

    async update(where, $set) {
        await this.collection.updateOne(where, {$set});
    }

    async getList(where) {
        const result = await this.collection.find(where).toArray();
        return result;
    }

    async getOne(where) {
        const result = await this.collection.find(where).toArray();
        return result;
    }

    async delete(where) {
        const result = await this.collection.deleteOne(where);
    }

    async deleteAll() {
        const result = await this.collection.deleteMany();
    }
}

module.exports = UserDao;