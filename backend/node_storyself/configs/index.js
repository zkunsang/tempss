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
    }
}

class MongoConfig {
    constructor(config) {
        this.url = config.url;
        this.port = config.port;
    }
}

module.exports = class Config {
    constructor(configPath) {
        this.configPath = configPath;
        this._isReady = false;

        this.apiServer = null;
    }

    ready() {
        let msg = 'configs: [' + this.configPath + '] ';
        try {
            this.apiServer = new ApiServerConfig(require(`@cf/${this.configPath}/apiServer.json`));
            this.dbMongo = new MongoConfig(require(`@cf/${this.configPath}/dbMongo.json`));
        } catch (e) {
            console.error(e);
            throw msg + e.message;
        }

        this._isReady = true;
        console.log(msg + 'ready');
    }

    isReady() {
        return this._isReady;
    }
}