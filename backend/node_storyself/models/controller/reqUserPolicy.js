const ValidateUtil = require('@ss/util');
const Model = require('@ss/models');
const { extend } = require('lodash');
const ValidType = ValidateUtil.ValidType;
const NullAllow = ValidateUtil.NullAllow;

const Schema = {
    SESSION_ID: { key: 'sessionID', required: true, type: ValidType.STRING },
    POLICY_VERSION: { key: 'policyVersion', required: true, type: ValidType.NUMBER }
}

class ReqUserPolicy extends Model {
    constructor({ sessionId }) {
        super();
        this[Schema.SESSION_ID.key] = sessionId;
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
