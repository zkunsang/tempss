const dbMongo = require('../dbMongo');
const ResourceDao = require('../daoMongo/ResourceDao');

class ResourceCacheModel {
    constructor() {
        this.resourceList = null;
    }

    async loadData(resourceDao) {
        this.resourceList = await resourceDao.findAll();
    }

    getList() {
        return this.resourceList;
    }
}

class ResourceCache {
    constructor() {    
        this.resourceDao = null;
        this.cacheManager = {};
        this.version = 1;
        this.currentCacheModel = null;
    }   
    
    async ready() {
        this.resourceDao = new ResourceDao(dbMongo);
    }

    async loadData(version) {
        this.cacheManager[version] = new ResourceCacheModel()
        await this.cacheManager[version].loadData(this.resourceDao);
        this.version = version;
        this.currentCacheModel = this.cacheManager[version];
    }

    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new ResourceCache();