const path = require('path');

class ApiServerConfig {
    constructor() {
        this.mode = 'local';
        this.port = 80;
        this.isSsl = false;
        this.sslKey = null;
        this.sslCert = null;
    }
}


module.exports = class Config {
    constructor(configPath) {
        this.configPath = configPath;
        this._isReady = false;

        this.apiServer = null;
    }

    ready(name) {
        let msg = 'configs: [' + name + '] ';
        let _path = path.normalize(this.configPath + '/' + name);
        try {
            //this.apiServer = Object.$syncProperties(new ApiServerConfig(), require(_path + '/apiServer.json'));
            this.apiServer = require(_path + '/apiServer.json');
        } catch (e) {
            throw msg + e.message.red;
        }

        this._isReady = true;
        console.log(msg + 'ready');
    }

    isReady() {
        return this._isReady;
    }
}