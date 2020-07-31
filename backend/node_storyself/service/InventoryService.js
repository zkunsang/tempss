const Item = require('@ss/models/mongo/Item');
const Inventory = require('@ss/models/mongo/Inventory');
const SSError = require('@ss/error');
const _ = require('lodash');


const PUT_ACTION = {
    PURCHASE: 'purchase',       // 구매 획득
}

const USE_ACTION = {
    PURCHASE: 'purchase',       // 구매 사용    
}

const ErrorObj = {
    putItemNoExistItem: { code: 30001, name: 'putItemNoExistItem', message: 'put item no exist item' },
    useItemNotEnoughItem: { code: 30002, name: 'putItemNotEnughItem', message: 'not enough Item' },
    useItemNoUseableItem: { code: 30003, name: 'useItemNoUseableItem', message: 'no useable item' },
}

class InventoryService {
    constructor(itemCategoryDao, itemDao, inventoryDao, userInfo, updateDate) {
        // cache system
        this.itemCategoryDao = itemCategoryDao;
        this.itemDao = itemDao;
        this.inventoryDao = inventoryDao;
        this.userInfo = userInfo;
        this.updateDate = updateDate;
    }

    async putItem(putItemList, actions) {
        
        const itemList = await this.itemDao.findAll();
        const itemMap = _.keyBy(itemList, Item.Schema.ITEM_ID.key);

        const uid = this.userInfo.getUID();

        const userInventoryListAll = await this.inventoryDao.findMany({ uid });
        const userInventoryMap = InventoryService.arrangeInventory(userInventoryListAll, itemMap);

        const insertList = [];
        const updateList = [];

        const createDate = this.updateDate;
        for (const putItem of putItemList) {
            const putInventory = new Inventory(putItem.makeInvetoryObject());
            putInventory.setUID(uid);
            putInventory.setUpdateDate(createDate);
            putInventory.setCreateDate(createDate);

            const itemId = putInventory.getItemId();
            const itemData = itemMap[itemId];

            InventoryService.checkItemData(itemData, itemId);

            const groupId = itemData.getGroupId();
            const userInventoryList = userInventoryMap[groupId];

            InventoryService.checkMaxQny(userInventoryList, putInventory, itemData);

            const volatileSec = itemData.getVolatileSeconds();
            if (volatileSec) {
                putInventory.addEndDate(createDate + volatileSec);
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

        await this.insertItemList(insertList);
        await this.updateItemList(updateList);
    }

    async useItem(useItemList, actions) {
        const itemList = await this.itemDao.findAll();
        const itemMap = _.keyBy(itemList, Item.Schema.ITEM_ID.key);

        const uid = this.userInfo.getUID();

        const userInventoryListAll = await this.inventoryDao.findMany({ uid });
        const userInventoryMap = InventoryService.arrangeInventory(userInventoryListAll, itemMap);

        const deleteList = [];
        const updateList = [];

        for (const useItem of useItemList) {
            const useInventory = new Inventory(useItem);

            const itemId = useInventory.getItemId();
            const itemData = itemMap[itemId];

            InventoryService.checkItemData(itemData);
            InventoryService.checkItemUseable(itemData);

            const groupId = itemData.getGroupId();

            const userInventoryList = userInventoryMap[groupId];

            InventoryService.calculateUse(userInventoryList, useInventory, itemMap, deleteList, updateList);
        }

        await this.deleteItemList(deleteList);
        await this.updateItemList(updateList);
    }

    async deleteItemList(deleteInventoryList) {
        for (const deleteInventory of deleteInventoryList) {
            const uid = deleteInventory.getUID();
            const itemId = deleteInventory.getItemId();
            const createDate = deleteInventory.getCreateDate();

            delete deleteInventory[Inventory.Schema.UID.key];
            delete deleteInventory[Inventory.Schema.UID.key];

            await this.inventoryDao.deleteOne({ uid, itemId, createDate }, deleteInventory);
        }
    }

    async insertItemList(insertList) {
        await this.inventoryDao.insertMany(insertList);
    }

    async updateItemList(updateInventoryList) {
        for (const updateInventory of updateInventoryList) {
            const uid = updateInventory.getUID();
            const itemId = updateInventory.getItemId();

            delete updateInventory[Inventory.Schema.UID.key];
            delete updateInventory[Inventory.Schema.ITEM_ID.key];
            await this.inventoryDao.updateOne({ uid, itemId }, updateInventory)
        }
    }

    static findUserInventoryItem(userInventoryList, invetory) {
        if(!userInventoryList) {
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
        if(!userInventoryList) return;
        const userQny = userInventoryList.reduce((acc, item) => acc += item.getItemQny(), 0)
        const addQny = putInventory.getItemQny();
        if (itemData.getMaxQny() < userQny + addQny) {
            throw new SSError.Service(
                ErrorObj.putItemOverMaxQny,
                `${itemData.getItemId()} - ${itemData.getMaxQny()} < ${userQny} + ${addQny}`);
        }
    }

    static checkUserQny(userInventoryList, useInventory) {
        const userQny = userInventoryList.reduce((acc, item) => acc += item.getItemQny(), 0);
        const useQny = useInventory.getItemQny();
        if (userQny < useQny) {
            throw new SSError.Service(
                ErrorObj.useItemNotEnoughItem,
                `${itemData.getItemId()} - ${userQny} < ${addQny}`);
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
            throw new SSError.Service(ErrorObj.putItemNoExistItem, `${itemId} - not exist`)
        }
    }

    static checkItemUseable(itemData) {
        if (!itemData.getUseable()) {
            throw new SSError.Service(ErrorObj.putItemNoExistItem, `${itemId} - not exist`)
        }
    }

    static checkUsePossible(itemId, totalQny, useQny) {
        if (useQny > totalQny) {
            throw new SSError.Service(
                ErrorObj.useItemNotEnoughItem,
                `${itemId} - ${useQny} > ${totalQny} not enugh item`);
        }
    }

    static calculateUse(userInventoryList, useInventory, itemMap, deleteList, updateList) {
        const userVolatileList = [];
        const userNonVolatileList = [];

        const totalQny = 0;
        for (const userInventory of userInventoryList) {
            const itemId = userInventory.getItemId();
            const itemData = itemMap[itemId];
            InventoryService.checkItemData(itemData, itemId);

            itemData.getVolatileSeconds() ?
                userVolatileList.push(userInventory) :
                userNonVolatileList.push(userInventory);

            totalQny += userInventory.getItemQny();
        }

        InventoryService.checkUsePossible(useInvengory.getItemId(), totalQny, useInventory.getItemQny());
        InventoryService.calculateUseVolatile(userVolatileList, useInventory, deleteList, updateList);
        InventoryService.calculateUseBasic(userNonVolatileList, useInventory, deleteList, updateList);
    }

    static calculateUseVolatile(userInventoryList, useInventory, deleteList, updateList) {
        userInventoryList.sort((a, b) => a.getEndDate() - b.getEndDate())
        calculateUseBasic(userInventoryList, useInventory, deleteList, updateList);
    }

    static calculateUseBasic(userInventoryList, useInventory, deleteList, updateList) {
        const deleteCnt = useInventory.getItemQny();

        for (const userVolatile of userInventoryList) {
            let invenItemQny = userVolatile.getItemQny();

            if (invenItemQny > deleteCnt) {
                userVolatile.minusItem(useInventory);
                useInventory.setItemQny(0);
                updateList.push(userVolatile);
                break;
            }

            if (invenItemQny === deleteCnt) {
                userVolatile.minusItem(useInventory);
                useInventory.setItemQny(0);
                deleteList.push(userVolatile)
                break;
            }

            if (invenItemQny < deleteCnt) {
                userVolatile.minusItem(inventory);
                useInventory.setItemQny(deleteCnt - invenItemQny);
                deleteList.push(userVolatile);
                break;
            }
        }
    }
}

module.exports = InventoryService;
module.exports.PUT_ACTION = PUT_ACTION;
module.exports.USE_ACTION = USE_ACTION;
