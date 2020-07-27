const ValidateUtil = require('../../util');
const ValidType = ValidateUtil.ValidType;
const NullAllow = ValidateUtil.NullAllow;

const Schema = {
    ADMIN_ID: { key: 'adminId', required: true, type: ValidType.STRING },
    PASSWORD: { key: 'password', required: true, type: ValidType.STRING },
}

class ReqAuthLogin {
    constructor({ adminId, password }) {
        this[Schema.ADMIN_ID.key] = adminId;
        this[Schema.PASSWORD.key] = password;
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
