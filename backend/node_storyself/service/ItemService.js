const ValidateUtil = require('@ss/util/ValidateUtil');
const ArrayUtil = require('@ss/util/ArrayUtil');
const ValidType = ValidateUtil.ValidType;
const Service = require('@ss/service/Service');

const Item = require('@ss/models/mongo/Item');
const ItemMaterial = require('@ss/models/mongo/ItemMaterial');

const ItemDao = require('@ss/daoMongo/ItemDao');
const ItemMaterialDao = require('@ss/daoMongo/ItemMaterialDao');
// const InventoryDao = require('@ss/daoMongo/InventoryDao');

const SSError = require('@ss/error');
const _ = require('lodash');

const Schema = {
    ITEM_DAO: { key: 'itemDao', required: true, type: ValidType.OBJECT, validObject: ItemDao },
    ITEM_LIST: { key: 'itemList', required: true, type: ValidType.ARRAY },
    ITEM_MAP: { key: 'itemMap', required: true, type: ValidType.OBJECT },

    ITEM_MATERIAL_DAO: { key: 'itemMaterialDao', required: true, type: ValidType.OBJECT, validObject: ItemMaterialDao },
    ITEM_MATERIAL_LIST: { key: 'itemMaterialList', required: true, type: ValidType.ARRAY },
    ITEM_MATERIAL_MAP: { key: 'itemMaterialMap', required: true, type: ValidType.OBJECT },
}

class ItemService extends Service {
    constructor(itemDao, itemMaterialDao) {
        super();
        this[Schema.ITEM_DAO.key] = itemDao;
        this[Schema.ITEM_LIST.key] = null;
        this[Schema.ITEM_MAP.key] = null;

        this[Schema.ITEM_MATERIAL_DAO.key] = itemMaterialDao;
        this[Schema.ITEM_MATERIAL_LIST.key] = null;
        this[Schema.ITEM_MATERIAL_MAP.key] = null;
    }

    // TODO: static data memory cache system
    async ready() {
        this[Schema.ITEM_LIST.key] = ItemDao.mappingList(await this[Schema.ITEM_DAO.key].findAll());
        this[Schema.ITEM_MAP.key] = _.keyBy(this[Schema.ITEM_LIST.key], Item.Schema.ITEM_ID.key);

        this[Schema.ITEM_MATERIAL_LIST.key] = ItemMaterialDao.mappingList(await this[Schema.ITEM_MATERIAL_DAO.key].findAll());
        this[Schema.ITEM_MATERIAL_MAP.key] =
            ArrayUtil.getMapArrayByKey(this[Schema.ITEM_MATERIAL_LIST.key], ItemMaterial.Schema.ITEM_ID.key);
    }

    getItemList(itemList) {
        Service.Validate.checkEmptyArray(itemList);
        return this.filterItemList(itemList);
    }

    filterItemList(itemList) {
        const notExistItem = [];
        const existItem = [];

        for (const item of itemList) {
            const itemData = this[Schema.ITEM_MAP.key][item];
            if (!itemData) {
                notExistItem.push(item);
            }
            existItem.push(itemData);
        }

        if (notExistItem.length > 0) {
            throw new SSError.Service(SSError.Service.Code.noExistItemList, `[${notExistItem.join(',')}] not exist item`)
        }

        return existItem;
    }


    _getMaterialList(putInventoryList) {
        const materialList = [];
        for (const inventory of putInventoryList) {
            materialList.push(...this[Schema.ITEM_MATERIAL_MAP.key][inventory.getItemId()]);
        }

        return materialList;
    }

    getMaterialInventoryList(putInventoryList) {
        const materialList = this._getMaterialList(putInventoryList);
        return ItemMaterial.makeInvetoryObjectList(materialList);
    }

    getExchangeInventoryInfo(inventoryList) {
        const putInventoryList = inventoryList;
        const useInventoryList = this.getMaterialInventoryList(inventoryList);

        return { useInventoryList, putInventoryList }
    }
}

module.exports = ItemService;
module.exports.Schema = Schema;