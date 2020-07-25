const ValidateUtil = require('../../util');

const Schema = {
    UID: 'uid',
    STATUS: 'status',
    EMAIL: 'email',
    PROVIDER: 'provider',
    CREATE_DATE: 'createDate',
    LAST_LOGIN_DATE: 'lastLoginDate',
    POLICY_VERSION: 'policyVersion',
}

class User {
    constructor({ uid, email, provider, status, createDate, lastLoginDate, policyVersion }) {
        this[Schema.UID] = uid;
        this[Schema.EMAIL] = email;
        this[Schema.PROVIDER] = provider;
        this[Schema.STATUS] = status;
        this[Schema.CREATE_DATE] = createDate;
        this[Schema.LAST_LOGIN_DATE] = lastLoginDate;
        this[Schema.POLICY_VERSION] = policyVersion;

        User.validModel(this);
    }

    static validModel(user) {
        User._validCommon(user, ValidateUtil.NullAllow.NO);
    }

    static validValue(user) {
        User._validCommon(user, ValidateUtil.NullAllow.YES);
    }

    static _validCommon(user, nullable) {
        /** TODO: validValue */
        // ValidateUtil.validValue(User, status);
        ValidateUtil.validString(User, Schema.UID, user[Schema.UID], nullable);
        ValidateUtil.validEmail(User, Schema.EMAIL, user[Schema.EMAIL], nullable);
        ValidateUtil.validString(User, Schema.PROVIDER, user[Schema.PROVIDER], nullable);
        ValidateUtil.validUnixTimeStamp(User, Schema.CREATE_DATE, user[Schema.CREATE_DATE], nullable);
        ValidateUtil.validUnixTimeStamp(User, Schema.LAST_LOGIN_DATE, user[Schema.LAST_LOGIN_DATE], nullable);
        ValidateUtil.validNumber(User, Schema.POLICY_VERSION, user[Schema.POLICY_VERSION], nullable);
    }
};

module.exports = User;
module.exports.Schema = Schema;

