const RunTimeError = require('./runTimeError');

class ControllerError extends RunTimeError {
    constructor(errCode, errObj) {
        super('ControllerError', errCode, errObj);
    }
}

module.exports = ControllerError;
module.exports.Code = {
    
}
