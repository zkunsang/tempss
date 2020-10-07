const dbMongo = require('../dbMongo');
const ProductDao = require('../daoMongo/ProductDao');

const Product = require('../models/mongo/Product');
const _ = require('lodash');

class ProductCacheModel {
    constructor() {
        this.productList = null;
        this.productMap = null;
    }

    async loadData(productDao) {
        this.productList = await productDao.findAll();

        this.parseProductMap();
    }

    parseProductMap() {
        this.productMap = _.keyBy(this.productList, Product.Schema.PRODUCT_ID.key);
    }

    get(productId) {
        return this.productMap[productId];
    }

    getList() {
        return this.productList;
    }
}

class ProductCache {
    constructor() {    
        this.productDao = null;
        this.cacheManager = {};
        this.version = 1;
        this.currentCacheModel = null;
    }   
    
    async ready() {
        this.productDao = new ProductDao(dbMongo);
    }

    async loadData(version) {
        this.cacheManager[version] = new ProductCacheModel()
        await this.cacheManager[version].loadData(this.productDao);
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

module.exports = new ProductCache();