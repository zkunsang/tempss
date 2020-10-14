const dbMongo = require('../dbMongo');
const DataTableDao = require('../daoMongo/DataTableDao');

const DataTable = require('../models/mongo/DataTable');

const _ = require('lodash');

class DataTableCacheModel {
    constructor() {
        this.dataTableList = null;
        this.dataTableMap = null;
    }

    async loadData(dataTableDao) {
        this.dataTableList = await dataTableDao.findAll();

        this.parseDataTable();
    }

    parseDataTable() {
        this.dataTableMap = _.keyBy(this.dataTableList, DataTable.Schema.TABLE_ID);
    }

    get(tableId) {
        return this.dataTableMap[tableId];
    }

    getList() {
        return this.dataTableList;
    }
}

class DataTableCache {
    constructor() {    
        this.dataTableDao = null;
        this.cacheManager = {};
        this.version = 1;
        this.currentCacheModel = null;
    }   
    
    async ready() {
        this.dataTableDao = new DataTableDao(dbMongo);
    }

    async loadData(version) {
        this.cacheManager[version] = new DataTableCacheModel()
        await this.cacheManager[version].loadData(this.dataTableDao);
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

    getMap() {
        return this.currentCacheModel.getMap();
    }
}

module.exports = new DataTableCache();