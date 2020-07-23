const RunTimeError = require('./runTimeError');

class UncaughtError extends RunTimeError {
    constructor(errObj) {
        super('UncaughtError', errObj);
    }
}

module.exports = UncaughtError;