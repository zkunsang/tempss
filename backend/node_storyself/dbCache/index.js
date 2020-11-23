const ItemCache = require('./ItemCache');
const ItemMaterialCache = require('./ItemMaterialCache');
const ProductCache = require('./ProductCache');
const ProductGroupCache = require('./ProductGroupCache');
const ProductRewardCache = require('./ProductRewardCache');
const ResourceCache = require('@ss/dbCache/ResourceCache');
const StoryCache = require('@ss/dbCache/StoryCache');
const DataTableCache = require('@ss/dbCache/DataTableCache');

const Schema = {
    ITEM_CACHE: 'itemCache',
    ITEM_MATERIAL_CACHE: 'itemMaterialCache',
    PRODUCT_CACHE: 'productCache',
    PRODUCT_GROUP_CACHE: 'productGroupCache',
    PRODUCT_REWARD_CACHE: 'productRewardCache',
    RESOURCE_CACHE: 'resourceCache',
    STORY_CACHE: 'storyCache',
    DATA_TABLE_CACHE: 'dataTableCache'
}

class CacheManager {
    constructor() {
        this.cache = {};
        this.cache[Schema.ITEM_CACHE] = ItemCache;
        this.cache[Schema.ITEM_MATERIAL_CACHE] = ItemMaterialCache;
        this.cache[Schema.PRODUCT_CACHE] = ProductCache;
        this.cache[Schema.PRODUCT_GROUP_CACHE] = ProductGroupCache;
        this.cache[Schema.PRODUCT_REWARD_CACHE] = ProductRewardCache;
        this.cache[Schema.RESOURCE_CACHE] = ResourceCache;
        this.cache[Schema.STORY_CACHE] = StoryCache;
        this.cache[Schema.DATA_TABLE_CACHE] = DataTableCache;
    }

    async ready() {
        await this.cache[Schema.DATA_TABLE_CACHE].ready();
        await this.cache[Schema.ITEM_CACHE].ready();
        await this.cache[Schema.ITEM_MATERIAL_CACHE].ready();
        await this.cache[Schema.PRODUCT_CACHE].ready();
        await this.cache[Schema.PRODUCT_GROUP_CACHE].ready();
        await this.cache[Schema.PRODUCT_REWARD_CACHE].ready();
        await this.cache[Schema.RESOURCE_CACHE].ready();
        await this.cache[Schema.STORY_CACHE].ready();

        await this.reloadDataTableCache();
    }

    // pubsub으로 받음
    async reloadDataTableCache() {
        // DATA_TABLE의 버젼이 따로 필요할듯..
        await this.cache[Schema.DATA_TABLE_CACHE].loadData();
        const dataTableCacheModel = this.cache[Schema.DATA_TABLE_CACHE].getCacheModel();
        await this.reloadAllData(dataTableCacheModel);
    }

    async reloadAllData(dataTableCacheModel) {
        await this.cache[Schema.ITEM_CACHE].loadData(dataTableCacheModel);
        await this.cache[Schema.ITEM_MATERIAL_CACHE].loadData(dataTableCacheModel);
        await this.cache[Schema.PRODUCT_CACHE].loadData(dataTableCacheModel);
        await this.cache[Schema.PRODUCT_GROUP_CACHE].loadData(dataTableCacheModel);
        await this.cache[Schema.PRODUCT_REWARD_CACHE].loadData(dataTableCacheModel);
        await this.cache[Schema.RESOURCE_CACHE].loadData(dataTableCacheModel);
        await this.cache[Schema.STORY_CACHE].loadData(dataTableCacheModel);
    }
 
    async updateCache(tableName, version) {
        this.cache[tableName].loadData(version);
    }
}

const cache = new CacheManager();
module.exports = cache;