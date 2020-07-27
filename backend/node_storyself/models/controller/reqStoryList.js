const ValidateUtil = require('../../util');
const ValidType = ValidateUtil.ValidType;
const NullAllow = ValidateUtil.NullAllow;

const Schema = {
    SESSION_ID: { key: 'sessionID', required: true, type: ValidType.STRING },
}

class ReqStoryList {
    constructor({ sessionId }) {
        this[Schema.SESSION_ID.key] = sessionId;
    }

    static validModel(obj) {
        ReqAuthLogout._validCommon(obj, NullAllow.NO);
    }

    static _validCommon(obj, nullable) {
        ValidateUtil.valid(ReqAuthLogout, Schema, obj, nullable);
    }

    getSessionId() {
        return this[Schema.SESSION_ID.key];
    }
}

module.exports = ReqStoryList;
module.exports.Schema = Schema;
