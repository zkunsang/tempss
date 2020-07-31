const RunTimeError = require('./RuntimeError');

class ServiceError extends RunTimeError {
    constructor(errObj, additionalMessage) {
        super('ServiceError', errObj);
        this.additionalMessage = additionalMessage;
    }
}

module.exports = ServiceError;