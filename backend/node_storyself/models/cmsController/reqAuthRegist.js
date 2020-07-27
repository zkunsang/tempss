const ValidateUtil = require('../../util');

const Platform = ValidateUtil.Platform;
const Provider = ValidateUtil.Provider;
const ValidType = ValidateUtil.ValidType;
const NullAllow = ValidateUtil.NullAllow;
const AppStore = ValidateUtil.AppStore;

const Schema = {
    ADMIN_ID: { key: 'adminId', required: true, type: ValidType.STRING },
    PASSWORD: { key: 'password', required: true, type: ValidType.STRING },
}

class ReqAuthRegist {
    constructor({ adminId, password }) {
        this[Schema.ADMIN_ID.key] = adminId;
        this[Schema.PASSWORD.key] = password;
    }

    static validModel(obj) {
        ReqAuthRegist._validCommon(obj, NullAllow.NO);
    }

    static _validCommon(obj, nullable) {
        ValidateUtil.valid(ReqAuthRegist, Schema, obj, nullable);
    }
}

module.exports = ReqAuthRegist;
module.exports.Schema = Schema;
