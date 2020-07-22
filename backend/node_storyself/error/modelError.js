const RunTimeError = require('./runTimeError');

class ModelError extends RunTimeError {
    constructor(errObj, additionalMessage) {
        super('ModelError', errObj);
        this.additionalMessage = additionalMessage;
    }
}

module.exports = ModelError;