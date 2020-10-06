const dbMongo = require('../dbMongo');
const StoryDao = require('../daoMongo/StoryDao');

const Story = require('../models/mongo/Story');
const _ = require('lodash');

class StoryCacheModel {
    constructor() {
        this.storyList = null;
        this.storyMap = null;
    }

    async loadData(storyDao) {
        this.storyList = await storyDao.findAll();

        this.parseProductByItemId();
    }

    parseProductByItemId() {
        this.storyMap = _.keyBy(this.storyList, Story.Schema.STORY_ID);
    }

    get(storyId) {
        return this.storyMap[storyId];
    }

    getList() {
        return this.storyList;
    }
}

class StoryCache {
    constructor() {    
        this.storyDao = null;
        this.cacheManager = {};
        this.version = 1;
        this.currentCacheModel = null;
    }   
    
    async ready() {
        this.storyDao = new StoryDao(dbMongo);
    }

    async loadData(version) {
        this.cacheManager[version] = new StoryCacheModel()
        await this.cacheManager[version].loadData(this.storyDao);
        this.version = version;
        this.currentCacheModel = this.cacheManager[version];
    }

    get(storyId) {
        return this.currentCacheModel.get(storyId);
    }
    
    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new StoryCache();