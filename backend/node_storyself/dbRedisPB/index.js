const ioredis = require('ioredis');
const ss = require('../index.js');
const dbCache = require('../dbCache');

const googleAuthChannel = "googleAuth"
const dataTableChannel = "dataTable"

const Channels = {
    googleAuth: "googleAuth",
    dataTable: "dataTable"
}

class RedisPubSubHelper {
    constructor() {
        this.accessToken = null;
    }

    async ready() {
        const { host, port } = ss.configs.dbRedisGA;
        const { subList } = ss.configs.dbRedisGA;

        this.redis = new ioredis({ host, port });
        if( subList.length == 0 ) return;

        this.accessToken = await this.redis.get(googleAuthChannel);
        
        this.redis.subscribe(Channels.googleAuth, async () => {
            console.log(`[${googleAuthChannel}] - subscribe - Start`)
        })

        this.redis.subscribe(Channels.dataTable, async() => {
            console.log(`[${dataTableChannel}] - subscribe - Start`)
        })

        this.redis.on("message", async (channel, message) => {
            console.log(`${channel}-${message}`);
            if(channel == Channels.googleAuth) {
                this.accessToken = message;
            }
            else if(channel == Channels.dataTable) {
                await dbCache.reloadDataTableCache();
            }
        })
    }

    getAccessToken() {
        return this.accessToken;
    }

    publish(channelId, message) {
        this.redis.publish(channelId, message)
    }
}

module.exports = new RedisPubSubHelper();
module.exports.Channels = Channels;