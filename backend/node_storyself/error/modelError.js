const RunTimeError = require('./runTimeError');

class ModelError extends RunTimeError {
    constructor(errObj, additionalMessage) {
        super('ModelError', errObj);
        this.additionalMessage = additionalMessage;
    }
}

module.exports = ModelError;
module.exports.Code = {
    setNoExistData: { code: 10001, name: 'setNoExistData', message: 'set can\'t be null' },
    setPrimaryKey: { code: 10002, name: 'setPrimaryKey', message: 'primary key doesn\'t allow change' },
    typeError: { code: 10003, name: 'typeError', message: 'check valid type' },
    insert: { code: 10004, name: 'insert', message: 'insert validate' },
    where: { code: 10005, name: 'where', message: 'no match where phrase'},
}