const Session = require("../models/redis/session");
//const sessionExpireMs = 1000 * 60 * 60 * 2;
const sessionExpire = 60 * 60 * 2;

class SessionDao {
    constructor(connection) {
        this.connection = connection;
    }

    async set(sessionId, user) {
        await this.connection.set(`${Session.key}:${sessionId}`, JSON.stringify(user), 'ex', sessionExpire);
    }

    async get(sessionId) {
        const user = JSON.parse(await this.connection.get(`${Session.key}:${sessionId}`));
        return user;
    }

    async del(sessionId) {
        await this.connection.del(`${Session.key}:${sessionId}`);
    }
}

module.exports = SessionDao;