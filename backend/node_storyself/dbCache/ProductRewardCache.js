const dbMongo = require('../dbMongo');

const ProductRewardDao = require('../daoMongo/ProductRewardDao');
const ProductReward = require('../models/mongo/ProductReward');

const _ = require('lodash');

class ProductRewardCacheModel {
    constructor() {
        this.productRewardList = null;
        this.productGroupMap = null;
    }

    async loadData(productRewardDao) {
        this.productRewardList = await productRewardDao.findAll();

        this.parseProductReward();
    }

    parseProductReward() {
        this.productGroupMap = _.keyBy(this.productGroupList, ProductReward.Schema.PRODUCT_ID);
    }

    get(groupId) {
        return this.productGroupMap[groupId];
    }

    getList() {
        return this.productRewardList;
    }
}

class ProductRewardCache {
    constructor() {    
        this.productRewardDao = null;
        this.cacheManager = {};
        this.version = 1;
        this.currentCacheModel = null;
    }   
    
    async ready() {
        this.productRewardDao = new ProductRewardDao(dbMongo);
    }

    async loadData(version) {
        this.cacheManager[version] = new ProductRewardCacheModel();
        await this.cacheManager[version].loadData(this.productRewardDao);
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

module.exports = new ProductRewardCache();