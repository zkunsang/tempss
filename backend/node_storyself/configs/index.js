const path = require('path');

class ApiServerConfig {
    constructor(config) {
        this.mode = config.mode;
        this.port = config.port;
        this.isSsl = config.isSsl;
        this.sslKey = config.sslKey;
        this.sslCert = config.sslCert;
        this.cdnUrl = config.cdnUrl;
        this.appVersion = config.appVersion;
        this.apiUrl = config.apiUrl;
        this.policyVersion = config.policyVersion;
    }
}

class MongoConfig {
    constructor(config) {
        this.url = config.url;
        this.port = config.port;
    }
}

class SlackConfig {
    constructor(config) {
        this.webhookUrl = config.webhookUrl;
        this.useSlack = config.useSlack;
    }
}

class RedisConfig {
    constructor(config) {
        this.host = config.host;
        this.port = config.port;
    }
}

class FluentConfig {
    constructor(config) {
        this.tag = config.tag;
        this.host = config.host;
        this.port = config.port;
        this.timeout = config.timeout;
        this.reconnectInterval = config.reconnectInterval;
        this.useFluent = config.useFluent;
    }
}

// redis for google auth pub/sub
class RedisGoogleAuthPubSub {
    constructor(config) {
        this.host = config.host;
        this.port = config.port;
    }
}


module.exports = class Config {
    constructor(configPath) {
        this.configPath = configPath;
        this.apiServer = null;
        this.dbMongo = null;
        this.slack = null;
        this.fluent = null;
        this.dbRedisGoogleAuth = null;
    }

    ready() {
        let msg = 'configs: [' + this.configPath + '] ';
        try {
            this.apiServer = new ApiServerConfig(require(`@cf/${this.configPath}/apiServer.json`));
            this.dbMongo = new MongoConfig(require(`@cf/${this.configPath}/dbMongo.json`));
            this.dbRedis = new RedisConfig(require(`@cf/${this.configPath}/dbRedis.json`));
            this.slack = new SlackConfig(require(`@cf/${this.configPath}/slack.json`));
            this.fluent = new FluentConfig(require(`@cf/${this.configPath}/fluent.json`));
            this.dbRedisGoogleAuth = new RedisGoogleAuthPubSub(require(`@cf/${this.configPath}/dbRedisGoogleAuthPubSub.json`));
        } catch (e) {
            throw msg + e.message;
        }

        console.log(msg + 'ready');
    }
}