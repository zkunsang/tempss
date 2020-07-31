const ValidateUtil = require('@ss/util/ValidateUtil')

const NullAllow = ValidateUtil.NullAllow;

class Service {
    constructor() {}
    static validModel(obj) {
        this._validCommon.call(this, obj, NullAllow.NO);
    }
    
    static validValue(obj) {
        this._validCommon.call(this, obj, NullAllow.YES);
    }
    
    static _validCommon(obj, nullable) {
        ValidateUtil.valid(this, this.Schema, obj, nullable);
    }
}

module.exports = Service;