const ioredis = require('ioredis');

const ss = require('@ss');

const googleAuthChannel = "googleAuth"

class GoogleAuthHelper {
    constructor() {
        this.accessToken = null;
    }

    async ready() {
        const { host, port } = ss.configs.dbRedisGoogleAuth;
        this.redis = new ioredis({ host, port });
        this.accessToken = await this.redis.get(googleAuthChannel);
        
        this.redis.subscribe(googleAuthChannel, async () => {
            console.log(`subscribe start - ${this.accessToken}`);
        })

        this.redis.on("message", (channel, message) => {
            console.log(`${channel}-${message}`);
            if(channel == googleAuthChannel) {
                this.accessToken = message;
            }
        })
    }

    getAccessToken() {
        return this.accessToken;
    }
}

module.exports = new GoogleAuthHelper();
