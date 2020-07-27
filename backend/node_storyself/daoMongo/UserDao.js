const User = require('../models/mongo/User');
const Dao = require('./Dao');

class UserDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.db('user');
        this.collection = this.db.collection('user');

        this.dao = UserDao;
        this.model = User;
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