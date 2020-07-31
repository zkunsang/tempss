const RunTimeError = require('./RuntimeError');

class UncaughtError extends RunTimeError {
    constructor(errObj) {
        super('UncaughtError', errObj);
    }
}

module.exports = UncaughtError;