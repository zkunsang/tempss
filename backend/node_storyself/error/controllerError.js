const RunTimeError = require('./runTimeError');

class ControllerError extends RunTimeError {
    constructor(errObj) {
        super('ControllerError', errObj);
    }
}

module.exports = ControllerError;