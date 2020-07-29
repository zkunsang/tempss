const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const UserStatus = ValidateUtil.UserStatus;
const Provider = ValidateUtil.Provider;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER, validRange: Object.values(UserStatus) },
    EMAIL: { key: 'email', required: true, type: ValidType.EMAIL },
    PROVIDER: { key: 'provider', required: true, type: ValidType.STRING, validRange: Object.values(Provider) },
    CREATE_DATE: { key: 'createDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    LAST_LOGIN_DATE: { key: 'lastLoginDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    POLICY_VERSION: { key: 'policyVersion', required: false, type: ValidType.NUMBER },
    SESSION_ID: { key: 'sessionId', required: false, type: ValidType.STRING }
}

class User extends Model {
    constructor({ uid, email, provider, status, createDate, lastLoginDate, policyVersion, sessionId }) {
        super();

        this[Schema.UID.key] = uid;
        this[Schema.EMAIL.key] = email;
        this[Schema.PROVIDER.key] = provider;
        this[Schema.STATUS.key] = status;
        this[Schema.CREATE_DATE.key] = createDate;
        this[Schema.LAST_LOGIN_DATE.key] = lastLoginDate;
        this[Schema.POLICY_VERSION.key] = policyVersion;
        this[Schema.SESSION_ID.key] = sessionId;
    }

    getSessionId() {
        return this[Schema.SESSION_ID.key];
    }

    getUID() {
        return this[Schema.UID.key];
    }

    setSessionId(sessionId) {
        this[Schema.SESSION_ID.key] = sessionId;
    }

    setStatus(status) {
        this[Schema.STATUS.key] = status;
    }

    setLastLoginDate(lastLoginDate) {
        this[Schema.LAST_LOGIN_DATE.key] = lastLoginDate;
    }

    setPolicyVersion(policyVersion) {
        this[Schema.POLICY_VERSION.key] = policyVersion;
    }

    setCreateDate(createDate) {
        this[Schema.CREATE_DATE.key] = createDate;
    }
};

module.exports = User;
module.exports.Schema = Schema;
