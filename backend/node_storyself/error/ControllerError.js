const RuntimeError = require('./RuntimeError');

class ControllerError extends RuntimeError {
    constructor(errCode, errObj) {
        super('ControllerError', errCode, errObj);
    }
}

module.exports = ControllerError;
module.exports.Code = {
    
}
