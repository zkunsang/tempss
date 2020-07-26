const ioredis = require('ioredis');

const ss = require('@ss');
const helper = require('@ss/helper');

class Redis {
    constructor() {
        this.redis = null;
    }

    async ready() {
        const dbRedis = ss.configs.dbRedis;
        
        try {
            this.redis = new ioredis({ host: dbRedis.host, port: dbRedis.port });
        }
        catch (err) {
            helper.slack.sendMessage(err);
        }
    }
}

module.exports = new Redis();