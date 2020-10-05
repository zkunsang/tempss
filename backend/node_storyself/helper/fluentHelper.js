const logger = require('fluent-logger');
const ss = require('../index.js');

class FluentHelper {
    constructor() {
        this.logger = null;
    }

    async ready() {
        this.fluentConfig = ss.configs.fluent;

        if (!this.fluentConfig.useFluent) return;
        logger.createFluentSender()
        this.logger = logger.createFluentSender(
            this.fluentConfig.tag,
            {
                host: this.fluentConfig.host,
                port: this.fluentConfig.port,
                timeout: this.fluentConfig.timeout, // 1.0,
                reconnectInterval: this.fluentConfig.reconnectInterval // 600000 // 10 minutes
            });

    }

    sendLog(category, log) {
        if(!this.fluentConfig.useFluent) {
            // console.log(log);
            return;
        }
        this.logger.emit(category, log);
    }
}

module.exports = new FluentHelper();