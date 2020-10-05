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
            console.log(`${category} - ${JSON.stringify(log)}`);
            return;
        }

        if (typeof log !== 'object') {
            this.logger.emit(category, log);
        }
        else if (typeof log === 'Array') {
            for(const l in logs) {
                this.logger.emit(category, log);
            }
            
        }
        else {
            console.error('not supported log')
        }
    }
}

module.exports = new FluentHelper();