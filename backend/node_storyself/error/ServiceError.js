const RuntimeError = require('./RuntimeError');

class ServiceError extends RuntimeError {
    constructor(errObj, additionalMessage) {
        super('ServiceError', errObj);
        this.additionalMessage = additionalMessage;
    }
}

module.exports = ServiceError;