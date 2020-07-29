const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const StoryStatus = ValidateUtil.StoryStatus;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    STATUS: { key: 'status', required: true, type: ValidType.NUMBER, validRange: Object.values(StoryStatus) },
    VERSION: { key: 'version', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    THUMBNAIL: { key: 'thumbnail', required: true, type: ValidType.STRING },
    THUMBNAIL_CRC32: { key: 'thumbnailCrc32', required: true, type: ValidType.STRING },
    THUMBNAIL_VERSION: { key: 'thumbnailVersion', required: true, type: ValidType.NUMBER },
}

class Story extends Model {
    constructor({ storyId, status, version, thumbnail, thumbnailCrc32, thumbnailVersion }) {
        super();

        this[Schema.STORY_ID.key] = storyId;
        this[Schema.STATUS.key] = status;
        this[Schema.VERSION.key] = version;

        this[Schema.THUMBNAIL.key] = thumbnail;
        this[Schema.THUMBNAIL_CRC32.key] = thumbnailCrc32;
        this[Schema.THUMBNAIL_VERSION.key] = thumbnailVersion;
    }

    setVersion(version) {
        this[Schema.VERSION.key] = version;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getVersion() {
        return this[Schema.VERSION.key];
    }

    getStatus() {
        return this[Schema.STATUS.key];
    }

    getThumbnail() {
        return this[Schema.THUMBNAIL.key];
    }

    getThumbnailVersion() {
        return this[Schema.THUMBNAIL_VERSION.key];
    }

    getThumbnailCrc32() {
        return this[Schema.THUMBNAIL_CRC32.key];
    }
}

module.exports = Story;
module.exports.Schema = Schema;