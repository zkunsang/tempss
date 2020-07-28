const ValidateUtil = require('@ss/util');
const Model = require('@ss/models');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    SESSION_ID: { key: 'sessionId', required: true, type: ValidType.STRING },
}

class ReqSession extends Model {
    constructor({ sessionId }) {
        super();
        this[Schema.SESSION_ID.key] = sessionId;
    }

    getSessionId() {
        return this[Schema.SESSION_ID.key];
    }
}

module.exports = ReqSession;
module.exports.Schema = Schema;