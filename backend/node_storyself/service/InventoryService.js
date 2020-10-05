const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const helper = require('../helper');
const Service = require('../service/Service');

const Item = require('../models/mongo/Item');
const User = require('../models/mongo/User');
const Inventory = require('../models/mongo/Inventory');

const InventoryPutObject = require('../models/service/InventoryPutObject');
const InventoryUseObject = require('../models/service/InventoryUseObject');

const InventoryDao = require('../daoMongo/InventoryDao');
const ItemDao = require('../daoMongo/ItemDao');
const ItemCategoryDao = require('../daoMongo/ItemCategoryDao');

const InventoryChangeInsert = require('../models/service/InventoryChangeInsert');
const InventoryChangeUpdate = require('../models/service/InventoryChangeUpdate');

const SSError = require('../error');
const _ = require('lodash');

const PUT_ACTION = {
    CEHAT: 'cheat',             // cheat
    PURCHASE: 'purchase',       // 상품 현금 구매
    STORY_BUY: 'storybuy',      // 스토리 구매
}

const USE_ACTION = {
    CEHAT: 'cheat',             // cheat
    STORY_BUY: 'storybuy'       // 스토리 구매
}

const Schema = {
    ITEM_CATEGORY_DAO: { key: 'itemCategoryDao', required: true, type: ValidType.OBJECT, validObject: ItemCategoryDao },
    ITEM_DAO: { key: 'itemDao', required: true, type: ValidType.OBJECT, validObject: ItemDao },
    INVENTORY_DAO: { key: 'inventoryDao', required: true, type: ValidType.OBJECT, validObject: InventoryDao },
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class InventoryService extends Service {
    constructor(itemCategoryDao, itemDao, inventoryDao, userInfo, updateDate) {
        super();
        // cache system
        this[Schema.ITEM_CATEGORY_DAO.key] = itemCategoryDao;
        this[Schema.ITEM_DAO.key] = itemDao;
        this[Schema.INVENTORY_DAO.key] = inventoryDao;
        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    async getUserInventoryList() {
        const uid = this.userInfo.uid;
        return await this.inventoryDao.findMany({uid});
    }
    
    async checkPutItem(putInventoryList) {
        Service.Validate.checkArrayObject(putInventoryList, Inventory);
        const sortedInventoryList = InventoryService.sortInventoryList(putInventoryList);

        const itemList = await this.itemDao.findAll();
        const itemMap = _.keyBy(itemList, Item.Schema.ITEM_ID.key);

        const uid = this.userInfo.getUID();

        
        const userInventoryListAll = await this.getUserInventoryList(); 
        const userInventoryMap = InventoryService.arrangeInventory(userInventoryListAll, itemMap);

        const insertList = [];
        const updateList = [];

        const createDate = this.updateDate;
        const beforeInvenMap = {};

        // 변경전 해당 아이템 그룹들의 총량을 미리 계산?
        for (const putInventory of sortedInventoryList) {
            putInventory.setUID(uid);
            putInventory.setUpdateDate(createDate);
            putInventory.setCreateDate(createDate);

            Inventory.validModel(putInventory);

            const itemId = putInventory.getItemId();
            const itemData = itemMap[itemId];

            InventoryService.checkItemData(itemData, itemId);

            const groupId = itemData.getGroupId();
            const userInventoryList = userInventoryMap[groupId];

            InventoryService.checkMaxQny(userInventoryList, putInventory, itemData);
            InventoryService.createBeforeInvenInfo(userInventoryList, beforeInvenMap);
            
            const volatileSec = itemData.getVolatileSeconds();
            if (volatileSec) {
                putInventory.setEndDate(createDate + volatileSec);
                insertList.push(putInventory);
                continue;
            }
            if (!itemData.getOverLap()) {
                insertList.push(putInventory);
                continue;
            }

            const userInventory = InventoryService.findUserInventoryItem(userInventoryList, putInventory);

            if (!userInventory) {
                insertList.push(putInventory);
                continue;
            }

            userInventory.addItem(putInventory);
            updateList.push(userInventory);
        }

        return new InventoryPutObject({ insertList, updateList, beforeInvenMap });
    }

    /**
     * 
     * @param {InventoryPutObject} putObject 
     */
    async putItem(putObject) {
        InventoryPutObject.validModel(putObject);
        await this.insertItemList(putObject.getInsertList());
        await this.updateItemList(putObject.getUpdateList());
        
        const uid = this[Schema.USER_INFO.key].getUID();
        const updateDate = this[Schema.UPDATE_DATE.key];

        this.logPutItem(uid, updateDate, putObject);
    }

    /**
     * 
     * @param {InventoryPutObject} putObject 
     */
    logPutItem(uid, logDate, putObject) {
        const changeList = this.getPutInventoryChangeList(putObject);
        const changeLogList = this.createChangeLogList(uid, logDate, changeList);
        helper.fluent.sendLog('inventory', changeLogList);
    }

    createChangeLogList(uid, logDate, changeList) {
        return changeList.map((change) => change.getInvenLog(uid, logDate));
    }
    
    /**
     * 
     * @param {InventoryPutObject} putObject 
     */
    getPutInventoryChangeList(putObject) {
        const beforeInvenMap = putObject.getBeforeInvenMap();
        const updateList = putObject.getUpdateList();
        const insertList = putObject.getInsertList()

        // 신규 추가된 아이템
        const afterInvenMap = {};
        
        // item별로 처리
        this.makeAfterMap(afterInvenMap, insertList);
        this.makeAfterMap(afterInvenMap, updateList);
        this.makeAfterMapWithMap(afterInvenMap, beforeInvenMap);

        const beforeList = Object.values(beforeInvenMap);
        const afterList = Object.values(afterInvenMap);

        const changeList = []
        
        // 이전 리스트
        for (const beforeInven of beforeList) {
            const itemId = beforeInven.getItemId();
            const afterInven = afterInvenMap[itemId];

            if(afterInven.getItemQny() == beforeInven.getItemQny()) {
                continue;
            }

            const changeMap = new InventoryChangeUpdate({ beforeInven, afterInven });
            changeList.push(changeMap);
        }

        for (const insertInven of insertList) {
            const changeMap = new InventoryChangeInsert({ insertInven });
            changeList.push(changeMap);
        }

        return changeList;
    }

    makeAfterMap(afterInvenMap, invenList) {
        for (const inventory of invenList) {
            const itemId = inventory.getItemId();
            if(!afterInvenMap[itemId]) {
                afterInvenMap[itemId] = inventory;
            }
            else {
                afterInvenMap[itemId].addItem(inventory);
            }
        }
    }

    makeAfterMapWithMap(afterInvenMap, beforeInvenMap) {
        const beforeList = Object.values(beforeInvenMap);

        for (const beforeInven of beforeList) {
            const itemId = beforeInven.getItemId();

            if(!afterInvenMap[itemId]) {
                afterInvenMap[itemId] = beforeInven;
            }
        }
    }

    async checkUseItem(useInventoryList) {
        Service.Validate.checkArrayObject(useInventoryList, Inventory);
        const sortedInventoryList = InventoryService.sortInventoryList(useInventoryList);

        const itemList = await this.itemDao.findAll();
        const itemMap = _.keyBy(itemList, Item.Schema.ITEM_ID.key);

        const uid = this.userInfo.getUID();

        const userInventoryListAll = await this.inventoryDao.findMany({ uid });
        const userInventoryMap = InventoryService.arrangeInventory(userInventoryListAll, itemMap);

        const deleteList = [];
        const updateList = [];

        const updateDate = this.updateDate;
        for (const useInventory of sortedInventoryList) {
            useInventory.setUpdateDate(updateDate);
            const itemId = useInventory.getItemId();
            const itemData = itemMap[itemId];

            InventoryService.checkItemData(itemData, itemId);
            InventoryService.checkItemUseable(itemData, itemId);

            const groupId = itemData.getGroupId();

            const userInventoryList = userInventoryMap[groupId];

            InventoryService.calculateUse(userInventoryList, useInventory, itemMap, deleteList, updateList);
        }

        return new InventoryUseObject({ deleteList, updateList });
    }

    async useItem(useObject) {
        InventoryUseObject.validModel(useObject);
        await this.deleteItemList(useObject.getDeleteList());
        await this.updateItemList(useObject.getUpdateList());
    }

    async deleteItemList(deleteInventoryList) {
        for (const deleteInventory of deleteInventoryList) {
            const _id = deleteInventory.getObjectId();

            delete deleteInventory[Inventory.Schema.OBJECT_ID.key];

            await this.inventoryDao.deleteOne({ _id }, deleteInventory);
        }
    }

    async insertItemList(insertList) {
        await this.inventoryDao.insertMany(insertList);
    }

    async updateItemList(updateInventoryList) {
        for (const updateInventory of updateInventoryList) {
            const _id = updateInventory.getObjectId();
            const copyInventory = Object.assign({}, updateInventory);

            delete copyInventory[Inventory.Schema.OBJECT_ID.key];
            delete copyInventory[Inventory.Schema.UID.key];
            delete copyInventory[Inventory.Schema.ITEM_ID.key];

            await this.inventoryDao.updateOne({ _id }, copyInventory)
        }
    }
    
    async processExchange(useInventoryList, putInventoryList) {
        const putObject = await this.checkPutItem(putInventoryList);
        const useObject = await this.checkUseItem(useInventoryList);

        await this.useItem(useObject);
        await this.putItem(putObject);
    }

    async processPut(putInventoryList) {
        const putObject = await this.checkPutItem(putInventoryList);
        await this.putItem(putObject);
        
    }

    async processUse(useInventoryList) {
        const useObject = await this.checkUseItem(useInventoryList);
        await this.useItem(useObject);
    }

    static findUserInventoryItem(userInventoryList, invetory) {
        if (!userInventoryList) {
            return null;
        }

        for (const userInventory of userInventoryList) {
            if (userInventory.getItemId() === invetory.getItemId()) {
                return userInventory;
            }
        }

        return null;
    }

    static checkMaxQny(userInventoryList, putInventory, itemData) {
        if (!userInventoryList) return;
        const userQny = userInventoryList.reduce((acc, item) => acc += item.getItemQny(), 0)
        const addQny = putInventory.getItemQny();
        if (itemData.getMaxQny() === 0) return;
        if (itemData.getMaxQny() < userQny + addQny) {
            throw new SSError.Service(
                SSError.Service.Code.putItemOverMaxQny,
                `${itemData.getItemId()} - ${itemData.getMaxQny()} < ${userQny} + ${addQny}`);
        }
    }

    static checkUserQny(userInventoryList, useInventory, itemData) {
        const userQny = userInventoryList.reduce((acc, item) => acc += item.getItemQny(), 0);
        const useQny = useInventory.getItemQny();
        
        if (userQny < useQny) {
            throw new SSError.Service(
                SSError.Service.Code.useItemNotEnoughItem,
                `${itemData.getItemId()} - ${userQny} < ${useQny}`);
        }
    }

    static arrangeInventory(inventoryList, itemMap) {
        const arrangedMap = {};
        for (const inventory of inventoryList) {
            const itemId = inventory.getItemId();
            const itemData = itemMap[itemId];
            const groupId = itemData.getGroupId();

            let itemList = arrangedMap[groupId];
            if (!itemList) {
                itemList = [];
                arrangedMap[groupId] = itemList;
            }

            itemList.push(inventory);
        }

        return arrangedMap;
    }

    static checkItemData(itemData, itemId) {
        if (!itemData) {
            throw new SSError.Service(SSError.Service.Code.putItemNoExistItem, `${itemId} - not exist`);
        }
    }

    static checkItemUseable(itemData, itemId) {
        if (!itemData.getUseable()) {
            throw new SSError.Service(SSError.Service.Code.useItemNoUseableItem, `${itemId} - not useable`);
        }
    }

    static checkUsePossible(itemId, totalQny, useQny) {
        if (useQny > totalQny) {
            throw new SSError.Service(
                SSError.Service.Code.useItemNotEnoughItem,
                `${itemId} - ${useQny} > ${totalQny} not enugh item`);
        }
    }

    static calculateUse(userInventoryList, useInventory, itemMap, deleteList, updateList) {
        const userVolatileList = [];
        const userNonVolatileList = [];

        let totalQny = 0;
        for (const userInventory of userInventoryList || []) {
            const itemId = userInventory.getItemId();
            const itemData = itemMap[itemId];
            InventoryService.checkItemData(itemData, itemId);

            itemData.getVolatileSeconds() ?
                userVolatileList.push(userInventory) :
                userNonVolatileList.push(userInventory);

            totalQny += userInventory.getItemQny();
        }

        InventoryService.checkUsePossible(useInventory.getItemId(), totalQny, useInventory.getItemQny());
        InventoryService.calculateUseVolatile(userVolatileList, useInventory, deleteList, updateList);
        InventoryService.calculateUseBasic(userNonVolatileList, useInventory, deleteList, updateList);
    }

    static calculateUseVolatile(userInventoryList, useInventory, deleteList, updateList) {
        userInventoryList.sort((a, b) => a.getEndDate() - b.getEndDate())
        InventoryService.calculateUseBasic(userInventoryList, useInventory, deleteList, updateList);
    }

    static calculateUseBasic(userInventoryList, useInventory, deleteList, updateList) {
        const deleteCnt = useInventory.getItemQny();

        for (const userInventory of userInventoryList) {
            let invenItemQny = userInventory.getItemQny();

            if (invenItemQny > deleteCnt) {
                userInventory.minusItem(useInventory);
                useInventory.setItemQny(0);
                updateList.push(userInventory);
                break;
            }
            else if (invenItemQny === deleteCnt) {
                userInventory.minusItem(useInventory);
                useInventory.setItemQny(0);
                deleteList.push(userInventory)
                break;
            }
            else {
                userInventory.minusItem(userInventory);
                useInventory.setItemQny(deleteCnt - invenItemQny);
                deleteList.push(userInventory);
                break;
            }
        }
    }

    static makeInventoryObject(itemId, itemQny) {
        return new Inventory({ itemId, itemQny });
    }


    static sortInventoryList(inventoryList) {
        let returnObject = {};
        for (const inventory of inventoryList) {
            const itemId = inventory.getItemId();
            const itemQny = inventory.getItemQny();

            let tempInventory = returnObject[itemId]
            if (tempInventory) {
                tempInventory.setItemQny(tempInventory.getItemQny() + itemQny);
            }
            else {
                returnObject[itemId] = new Inventory(inventory);
            }
        }
        return Object.values(returnObject);
    }

    // using object id create map info once
    static createBeforeInvenInfo(userInventoryList, beforeInvenMap) {
        if (!userInventoryList) { return; }
        
        for (const inventory of userInventoryList) {
            const itemId = inventory.getItemId();
            
            if(!beforeInvenMap[itemId]) {
                beforeInvenMap[itemId] = new Inventory(inventory);
            }
            else {
                beforeInvenMap[itemId].addItem(inventory);
            }
        }
    }
}

module.exports = InventoryService;
module.exports.Schema = Schema;
module.exports.PUT_ACTION = PUT_ACTION;
module.exports.USE_ACTION = USE_ACTION;
