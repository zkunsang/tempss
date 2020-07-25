const ValidateUtil = require('../../util');
const User = require('../mongo/user.js');

const ValidType = ValidateUtil.ValidType;
const NullAllow = ValidateUtil.NullAllow;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    EMAIL: { key: 'email', required: true, type: ValidType.EMAIL },
    PROVIDER: { key: 'provider', required: true, type: ValidType.STRING, validRange: Object.values(User.Provider)}
}

class ReqAuthLogin {
    constructor({ uid, email, provider }) {
        this[Schema.UID.key] = uid;
        this[Schema.EMAIL.key] = email;
        this[Schema.PROVIDER.key] = provider;
    }

    static validModel(obj) {
        ReqAuthLogin._validCommon(obj, NullAllow.NO);
    }

    static _validCommon(obj, nullable) {
        ValidateUtil.valid(ReqAuthLogin, Schema, obj, nullable);
    }
}

module.exports = ReqAuthLogin;
module.exports.Schema = Schema;
