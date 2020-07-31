const RunTimeError = require('./RunTimeError');

class ControllerError extends RunTimeError {
    constructor(errCode, errObj) {
        super('ControllerError', errCode, errObj);
    }
}

module.exports = ControllerError;
module.exports.Code = {
    
}
