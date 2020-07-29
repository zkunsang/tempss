const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const StoryStatus = ValidateUtil.StoryStatus;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER, validRange: Object.values(StoryStatus) },
    THUMBNAIL: { key: 'thumbnail', required: true, type: ValidType.STRING },
    THUMBNAIL_CRC32: { key: 'thumbnailCrc32', required: true, type: ValidType.STRING },
    THUMBNAIL_VERSION: { key: 'thumbnailVersion', required: true, type: ValidType.NUMBER },

}

class ReqStoryCreate extends Model {
    constructor({ storyId, status, thumbnail, thumbnailCrc32, thumbnailVersion }) {
        super();
        this[Schema.STORY_ID.key] = storyId;
        this[Schema.STATUS.key] = status;
        this[Schema.THUMBNAIL.key] = thumbnail;
        this[Schema.THUMBNAIL_CRC32.key] = thumbnailCrc32;
        this[Schema.THUMBNAIL_VERSION.key] = thumbnailVersion;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }
}

module.exports = ReqStoryCreate;
module.exports.Schema = Schema;