const RunTimeError = require('./runTimeError');

class DaoError extends RunTimeError {
    constructor(errObj) {
        super('DaoError', errObj);
    }
}

module.exports = DaoError;
module.exports.Code = {
    getOneLength: { code: 20001, name: 'getOneLength', message: 'expect just one row'},
    updateOneCount: { code: 20002, name: 'updateOneCount', message: 'expect update just one' },
    updateManyCount: { code: 20003, name: 'updateManyCount', message: 'update more or less than expected' },
    setNoExistData: { code: 20004, name: 'setNoExistData', message: 'set can\'t be null' },
    setPrimaryKey: { code: 20005, name: 'setPrimaryKey', message: 'primary key doesn\'t allow change' },
    whereNoExistData: { code: 2006, name: 'whereNoExistData', message: 'no match where phrase'},
}

