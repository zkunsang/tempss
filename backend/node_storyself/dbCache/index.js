const ItemCache = require('./ItemCache');
const ItemMaterialCache = require('./ItemMaterialCache');
const ProductCache = require('./ProductCache');
const ProductGroupCache = require('./ProductGroupCache');
const ProductRewardCache = require('./ProductRewardCache');

const Schema = {
    ITEM_CACHE: 'itemCache',
    ITEM_MATERIAL_CACHE: 'itemMaterialCache',
    PRODUCT_CACHE: 'productCache',
    PRODUCT_GROUP_CACHE: 'productGroupCache',
    PRODUCT_REWARD_CACHE: 'productRewardCache'
}

class Cache {
    constructor() {
        this.cache = {};
        this.cache[Schema.ITEM_CACHE] = ItemCache;
        this.cache[Schema.ITEM_MATERIAL_CACHE] = ItemMaterialCache;
        this.cache[Schema.PRODUCT_CACHE] = ProductCache;
        this.cache[Schema.PRODUCT_GROUP_CACHE] = ProductGroupCache;
        this.cache[Schema.PRODUCT_REWARD_CACHE] = ProductRewardCache;
    }

    async ready() {
        // TODO: dataTable version loader
        await this.cache[Schema.ITEM_CACHE].ready();
        await this.cache[Schema.ITEM_MATERIAL_CACHE].ready();
        await this.cache[Schema.PRODUCT_CACHE].ready();
        await this.cache[Schema.PRODUCT_GROUP_CACHE].ready();
        await this.cache[Schema.PRODUCT_REWARD_CACHE].ready();
        
        await this.cache[Schema.ITEM_CACHE].loadData(1);
        await this.cache[Schema.ITEM_MATERIAL_CACHE].loadData(1);
        await this.cache[Schema.PRODUCT_CACHE].loadData(1);
        await this.cache[Schema.PRODUCT_GROUP_CACHE].loadData(1);
        await this.cache[Schema.PRODUCT_REWARD_CACHE].loadData(1);
    }
 
    // TODO: pubsub 데이터 리로드
    async updateCache(tableName, version) {
        this.cache[tableName].loadData(version);
    }
}

const cache = new Cache();
module.exports = cache;