const RunTimeError = require('./runTimeError');

class DaoError extends RunTimeError {
    constructor(errCode, errObj) {
        super('DaoError', errCode , errObj);
    }
}

module.exports = DaoError;
module.exports.Code = {
    uncaught: { code: 20000, name: 'uncaught' },
    insert: { code: 20001, name: 'insert' },
    update: { code: 20002, name: 'update' },
    delete: { code: 20003, name: 'delete' },
    read: { code: 20004, name: 'read' },
}

