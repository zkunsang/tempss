const RunTimeError = require('./runTimeError');

class ModelError extends RunTimeError {
    constructor(errObj, additionalMessage) {
        super('ModelError', errObj);
        this.additionalMessage = additionalMessage;
    }
}

module.exports = ModelError;
module.exports.Code = {
    validType: { code: 10003, name: 'validType', message: 'check valid type' },
    validValue: { code: 10004, name: 'validValue', message: 'check valid value' },
    where: { code: 10005, name: 'where', message: 'no match where phrase'},
}