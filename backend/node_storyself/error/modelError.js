const RunTimeError = require('./runTimeError');

class ModelError extends RunTimeError {
    constructor(errCode, errObj, additionalMessage) {
        super('ModelError', errCode, errObj);
        this.additionalMessage = additionalMessage;
    }
}

module.exports = ModelError;
module.exports.Code = {
    uncaught: { code: 10000, name: 'mapping'}, 
    mapping: { code: 10001, name: 'mapping'},
    updateFind: { code: 10002, name: 'updateFind'},
    updateSet: { code: 10003, name: 'updateSet'},
    insert: {code: 10004, name: 'insert'}
}