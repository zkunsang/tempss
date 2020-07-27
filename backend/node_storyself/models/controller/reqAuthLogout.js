const ValidateUtil = require('@ss/util');
const Model = require('@ss/models');
const ValidType = ValidateUtil.ValidType;
const NullAllow = ValidateUtil.NullAllow;

const Schema = {
    SESSION_ID: { key: 'sessionID', required: true, type: ValidType.STRING },
}

class ReqAuthLogout extends Model {
    constructor({ sessionId }) {
        super();
        this[Schema.SESSION_ID.key] = sessionId;
    }

    getSessionId() {
        return this[Schema.SESSION_ID.key];
    }
}

module.exports = ReqAuthLogout;
module.exports.Schema = Schema;
