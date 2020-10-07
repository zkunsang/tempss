const dbMongo = require('../dbMongo');

const ProductGroupDao = require('../daoMongo/ProductGroupDao');
const ProductGroup = require('../models/mongo/ProductGroup');

const _ = require('lodash');

class ProductGroupCacheModel {
    constructor() {
        this.productGroupList = null;
        this.productGroupMap = null;
    }

    async loadData(productGroupDao) {
        this.productGroupList = await productGroupDao.findAll();

        this.parseProductByItemId();
    }

    parseProductByItemId() {
        this.productGroupMap = _.keyBy(this.productGroupList, ProductGroup.Schema.GROUP_ID.key);
    }

    get(groupId) {
        return this.productGroupMap[groupId];
    }

    getList() {
        return this.productGroupList;
    }
}

class ProductGroupCache {
    constructor() {    
        this.productGroupDao = null;
        this.cacheManager = {};
        this.version = 1;
        this.currentCacheModel = null;
    }   
    
    async ready() {
        this.productGroupDao = new ProductGroupDao(dbMongo);
    }

    async loadData(version) {
        this.cacheManager[version] = new ProductGroupCacheModel();
        await this.cacheManager[version].loadData(this.productGroupDao);
        this.version = version;
        this.currentCacheModel = this.cacheManager[version];
    }

    get(groupId) {
        return this.currentCacheModel.get(groupId);
    }
    
    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new ProductGroupCache();