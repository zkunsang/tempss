const SSError = require('@ss/error');
const ValidateUtil = require('../../util');
const ValidType = ValidateUtil.ValidType;
const StoryStatus = ValidateUtil.StoryStatus;
const NullAllow = ValidateUtil.NullAllow;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER, validRange: Object.values(StoryStatus) },
    VERSION: { key: 'version', required: true, type: ValidType.NUMBER }
}
class Story {
    constructor({ storyId, status, version }) {
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.STATUS.key] = status;
        this[Schema.VERSION.key] = version;
    }

    static validModel(obj) {
        Story._validCommon(obj, NullAllow.NO);
    }

    static validValue(obj) {
        Story._validCommon(obj, NullAllow.YES);
    }

    static _validCommon(obj, nullable) {
        ValidateUtil.valid(Story, Schema, obj, nullable);
    }
}

module.exports = Story;
module.exports.Schema = Schema;