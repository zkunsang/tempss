const RunTimeError = require('./runTimeError');

class ModelError extends RunTimeError {
    constructor(errObj, additionalMessage) {
        super('ModelError', errObj);
        this.additionalMessage = additionalMessage;
    }
}

module.exports = ModelError;
module.exports.Code = {
    checkType: { code: 10003, name: 'checkType', message: 'check valid type' },
    validValue: { code: 10004, name: 'validValue', message: 'check valid value' },
    notValidEmail: { code: 10006, name: 'notValidEmail', message: 'check valid email'},
    
}