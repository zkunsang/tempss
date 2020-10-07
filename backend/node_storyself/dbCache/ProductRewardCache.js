const dbMongo = require('../dbMongo');

const ProductRewardDao = require('../daoMongo/ProductRewardDao');
const ProductReward = require('../models/mongo/ProductReward');

const ArrayUtil = require('@ss/util/ArrayUtil');

class ProductRewardCacheModel {
    constructor() {
        this.productRewardList = null;
        this.productRewardMap = null;
    }

    async loadData(productRewardDao) {
        this.productRewardList = await productRewardDao.findAll();

        this.parseProductReward();
    }

    parseProductReward() {
        this.productRewardMap = ArrayUtil.getMapArrayByKey(this.productRewardList, ProductReward.Schema.PRODUCT_ID.key);
    }

    get(productId) {
        return this.productRewardMap[productId];
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

    get(productId) {
        return this.currentCacheModel.get(productId);
    }
    
    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new ProductRewardCache();