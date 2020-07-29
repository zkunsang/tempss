const Model = require('@ss/models')

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
}

class ReqResourceList extends Model{
    constructor({ storyId }) {
        super();
        this[Schema.STORY_ID.key] = storyId;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }
}

module.exports = ReqResourceList;
module.exports.Schema = Schema;