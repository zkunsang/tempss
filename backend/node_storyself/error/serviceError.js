const RunTimeError = require('./runTimeError');

class ServiceError extends RunTimeError {
    constructor(errCode, errObj) {
        super('ServiceError', errCode, errObj);
    }
}

module.exports = ServiceError;
module.exports.Code = {
    
};