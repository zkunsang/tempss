const dbMongo = require('../dbMongo');
const ItemMaterialDao = require('../daoMongo/ItemMaterialDao');

const ItemMaterial = require('../models/mongo/ItemMaterial');
const ArrayUtil = require('../util/ArrayUtil');

class ItemMaterialCacheModel {
    constructor() {
        this.itemMaterialList = null;
        this.itemMaterialListByItemId = null;
    }

    async loadData(itemMaterialDao) {
        this.itemMaterialList = await itemMaterialDao.findAll();

        this.parseItemMaterialListByItemId();
    }

    parseItemMaterialListByItemId() {
        this.itemMaterialListByItemId = ArrayUtil.getMapArrayByKey(
            this.itemMaterialList,
            ItemMaterial.Schema.ITEM_ID);
    }

    getListByItemId(itemId) {
        return this.itemMaterialListByItemId[itemId];
    }

    getList() {
        return this.itemMaterialList;
    }
}

class ItemMaterialCache {
    constructor() {
        this.itemMaterialDao = null;
        this.cacheManager = {};
        this.version = 1;
        this.currentCacheModel = null;
    }

    async ready() {
        this.itemMaterialDao = new ItemMaterialDao(dbMongo);
    }

    async loadData(version) {
        this.cacheManager[version] = new ItemMaterialCacheModel();
        await this.cacheManager[version].loadData(this.itemMaterialDao);
        this.version = version;
        this.currentCacheModel = this.cacheManager[version];
    }

    getListByItemId(itemId) {
        return this.currentCacheModel.getListByItemId(itemId);
    }

    getList() {
        return this.currentCacheModel.getList();
    }
}

module.exports = new ItemMaterialCache();