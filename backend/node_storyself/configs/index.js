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

class GoogleOAuth2Config {
    constructor(config) {
        this.client_id = config.client_id;
        this.client_secret = config.client_secret;
        this.redirect_url = config.redirect_url;
    }
}


module.exports = class Config {
    constructor(configPath) {
        this.configPath = configPath;
        this.apiServer = null;
        this.dbMongo = null;
        this.slack = null;
        this.fluent = null;
        this.googleOAuth2 = null;
    }

    ready() {
        let msg = 'configs: [' + this.configPath + '] ';
        try {
            this.apiServer = new ApiServerConfig(require(`@cf/${this.configPath}/apiServer.json`));
            this.dbMongo = new MongoConfig(require(`@cf/${this.configPath}/dbMongo.json`));
            this.dbRedis = new RedisConfig(require(`@cf/${this.configPath}/dbRedis.json`));
            this.slack = new SlackConfig(require(`@cf/${this.configPath}/slack.json`));
            this.fluent = new FluentConfig(require(`@cf/${this.configPath}/fluent.json`));
            this.googleOAuth2 = new GoogleOAuth2Config(require(`@cf/${this.configPath}/googleOAuth2.json`));
        } catch (e) {
            throw msg + e.message;
        }

        console.log(msg + 'ready');
    }
}