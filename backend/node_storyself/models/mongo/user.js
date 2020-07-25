const ValidateUtil = require('../../util');
const ValidType = ValidateUtil.ValidType;

const UserStatus = {
    NONE: 1, 
    ADMIN: 2, 
    BLOCK: 3, 
}

const Provider = {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    EMAIL: 'email'
}

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER, validRange: Object.values(UserStatus) },
    EMAIL: { key: 'email', required: true, type: ValidType.EMAIL },
    PROVIDER: { key: 'provider', required: true, type: ValidType.STRING, validRange: Object.values(Provider) },
    CREATE_DATE: { key: 'createDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    LAST_LOGIN_DATE: { key: 'lastLoginDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    POLICY_VERSION: { key: 'policyVersion', required: false, type: ValidType.NUMBER }
}

class User {
    constructor({ uid, email, provider, status, createDate, lastLoginDate, policyVersion }) {
        this[Schema.UID.key] = uid;
        this[Schema.EMAIL.key] = email;
        this[Schema.PROVIDER.key] = provider;
        this[Schema.STATUS.key] = status;
        this[Schema.CREATE_DATE.key] = createDate;
        this[Schema.LAST_LOGIN_DATE.key] = lastLoginDate;
        this[Schema.POLICY_VERSION.key] = policyVersion;

        User.validModel(this);
    }

    static validModel(obj) {
        User._validCommon(obj, ValidateUtil.NullAllow.NO);
    }

    static validValue(obj) {
        User._validCommon(obj, ValidateUtil.NullAllow.YES);
    }

    static _validCommon(obj, nullable) {
        ValidateUtil.valid(User, Schema, obj, nullable);
    }
};

module.exports = User;
module.exports.Schema = Schema;
module.exports.Provider = Provider;
