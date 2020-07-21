class Resource {
    constructor(storyId, resourceId, size, version, crc32) {
        this.storyId = storyId;
        this.resourceId = resourceId;
        this.size = size;
        this.version = version;
        this.crc32 = crc32;
    }
}

module.exports = Resource;