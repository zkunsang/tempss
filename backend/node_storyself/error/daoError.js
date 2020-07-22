const RunTimeError = require('./runTimeError');

class DaoError extends RunTimeError {
    constructor(errObj) {
        super('DaoError', errObj);
    }
}

module.exports = DaoError;

