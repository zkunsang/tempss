const ValidateUtil = require('@ss/util');
const Model = require('@ss/models');
const ValidType = ValidateUtil.ValidType;
const StoryStatus = ValidateUtil.StoryStatus;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER, validRange: Object.values(StoryStatus) },
    VERSION: { key: 'version', required: true, type: ValidType.NUMBER }
}
class Story extends Model {
    constructor({ storyId, status, version }) {
        super();

        this[Schema.STORY_ID.key] = storyId;
        this[Schema.STATUS.key] = status;
        this[Schema.VERSION.key] = version;
    }
}

module.exports = Story;
module.exports.Schema = Schema;