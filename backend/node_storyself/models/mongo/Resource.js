const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    RESOURCE_ID: { key: 'resourceId', required: true, type: ValidType.STRING },
    SIZE: { key: 'size', required: true, type: ValidType.NUMBER },
    VERSION: { key: 'version', required: true, type: ValidType.NUMBER },
    CRC32: { key: 'crc32', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class Resource extends Model {
    constructor({ storyId, resourceId, size, version, crc32, updateDate }) {
        super();

        this[Schema.STORY_ID.key] = storyId || undefined;
        this[Schema.RESOURCE_ID.key] = resourceId || undefined;
        this[Schema.SIZE.key] = size || undefined;
        this[Schema.VERSION.key] = version || undefined;
        this[Schema.CRC32.key] = crc32 || undefined;
        this[Schema.UPDATE_DATE.key] = updateDate || undefined;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getStoryId() {
        return this[Schema.STORY_ID.key];
    }

    getResourceId() {
        return this[Schema.RESOURCE_ID.key];
    }
}

module.exports = Resource;
module.exports.Schema = Schema;