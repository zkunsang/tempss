const dbMongo = require('../dbMongo');
const ItemDao = require('../daoMongo/ItemDao');

const Item = require('../models/mongo/Item');
const ArrayUtil = require('../util/ArrayUtil');

const _ = require('lodash');

class ItemCacheModel {
    constructor() {
        this.itemList = null;
        this.itemMapByItemId = null;
        this.itemListByGroupId = null;
    }

    async loadData(itemDao) {
        this.itemList = await itemDao.findAll();

        this.parseItemByItemId();
        this.parseItemByGroupId();
    }

    parseItemByItemId() {
        this.itemMapByItemId = _.keyBy(this.itemList, Item.Schema.ITEM_ID.key);
    }

    parseItemByGroupId() {
        this.itemListByGroupId = ArrayUtil.getMapArrayByKey(this.itemList, Item.Schema.GROUP_ID);
    }

    get(itemId) {
        return this.itemMapByItemId[itemId];
    }

    getListByGroupId(groupId) {
        return this.itemListByGroupId[groupId]
    }

    getList() {
        return this.itemList;
    }
}

class ItemCache {
    constructor() {    
        this.itemDao = null;
        this.cacheManager = {};
        this.version = 1;
        this.currentCacheModel = null;
    }   
    
    async ready() {
        this.itemDao = new ItemDao(dbMongo);
    }

    async loadData(version) {
        this.cacheManager[version] = new ItemCacheModel()
        await this.cacheManager[version].loadData(this.itemDao);
        this.version = version;
        this.currentCacheModel = this.cacheManager[version];
    }

    get(itemId) {
        return this.currentCacheModel.get(itemId);
    }

    getListByGroupId(groupId) {
        return this.currentCacheModel.getListByGroupId(groupId);
    }
    
    getList() {
        return this.currentCacheModel.getList();
    }

    getMap(I) {
        return this.currentCacheModel.getMap();
    }
}

module.exports = new ItemCache();