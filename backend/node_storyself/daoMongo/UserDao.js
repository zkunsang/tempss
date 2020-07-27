const User = require('../models/mongo/user');
const Dao = require('./Dao');

class UserDao {
    constructor(connection) {
        this.db = connection.db('user');
        this.collection = this.db.collection('user');
    }

    async insertOne(user) {
        UserDao.insertValid(user);
        await this.collection.insertOne(user);
    }

    async updateOne(where, $set) {
        UserDao.checkWhere(where);
        UserDao.checkSet($set);

        const result = await this.collection.updateMany(where, { $set });
        Dao.checkUpdateCount(result.modifiedCount, 1, UserDao, where, $set);
    }

    async findOne(where) {
        UserDao.checkWhere(where);

        const result = await this.collection.find(where).toArray();

        if (result.length === 0) return null;
        Dao.checkFindCount(result.length, 1, UserDao, where);

        return new User(result[0]);
    }

    // NOT ALLOWED TO DELETE USER DATA. change user status
    async deleteOne(where) {
        Dao.checkTestEnv();
        UserDao.checkWhere(where);
        const result = await this.collection.deleteMany(where);
        Dao.checkDeleteOneCount(result.deletedCount, UserDao, where);
    }

    // NOT ALLOWED TO DELETE USER DATA. change user status
    async deleteAll() {
        Dao.checkTestEnv();
        await this.collection.deleteMany();
    }

    static insertValid(user) {
        Dao.checkValidObj(User, user);
        Dao.checkInsertField(UserDao, user);
    }

    static checkWhere(where) {
        Dao.checkAllowWhereField(UserDao, where);
        User.validValue(where);
    }

    static checkSet($set) {
        Dao.checkNotAllowSetNull(UserDao, $set);
        Dao.checkAllowSetField(UserDao, $set);
        Dao.checkNotAllowSetField(UserDao, $set);
        User.validValue($set);
    }

    static requireInsertFieldList() {
        return [
            User.Schema.UID.key,
            User.Schema.PROVIDER.key,
            User.Schema.EMAIL.key,
            User.Schema.LAST_LOGIN_DATE.key,
            User.Schema.CREATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            User.Schema.UID.key,
            User.Schema.EMAIL.key
        ];
    }

    static allowSetFieldList() {
        return [
            User.Schema.LAST_LOGIN_DATE.key,
            User.Schema.POLICY_VERSION.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            User.Schema.UID.key,
            User.Schema.EMAIL.key,
            User.Schema.CREATE_DATE.key,
            User.Schema.PROVIDER.key
        ]
    };
}

module.exports = UserDao;