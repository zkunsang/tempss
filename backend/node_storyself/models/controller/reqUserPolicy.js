const ValidateUtil = require('../../util');
const ValidType = ValidateUtil.ValidType;
const NullAllow = ValidateUtil.NullAllow;

const Schema = {
    SESSION_ID: { key: 'sessionID', required: true, type: ValidType.STRING },
    POLICY_VERSION: { key: 'policyVersion', required: true, type: ValidType.NUMBER }
}

class ReqUserPolicy {
    constructor({ sessionId }) {
        this[Schema.SESSION_ID.key] = sessionId;
    }

    static validModel(obj) {
        ReqUserPolicy._validCommon(obj, NullAllow.NO);
    }

    static _validCommon(obj, nullable) {
        ValidateUtil.valid(ReqUserPolicy, Schema, obj, nullable);
    }

    getSessionId() {
        return this[Schema.SESSION_ID.key];
    }

    getPolicyVersion() {
        return this[Schema.POLICY_VERSION.key];
    }
}

module.exports = ReqUserPolicy;
module.exports.Schema = Schema;
