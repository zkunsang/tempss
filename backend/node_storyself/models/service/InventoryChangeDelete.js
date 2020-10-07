const Model = require('../../models');
const InvenLog = require('../apilog/InvenLog');
const ItemCache = require('../../dbCache/ItemCache');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    DELETE_INVEN: { key: 'deleteInven', required: true, type: ValidType.OBJECT },
}

class InventoryChangeDelete extends Model {
    constructor({ deleteInven }) {
        super();
        this[Schema.DELETE_INVEN.key] = deleteInven;
    }

    getInvenLog(uid, logDate) {
        const deleteInven = this[Schema.DELETE_INVEN.key];
        const itemId = deleteInven.getItemId();
        
        const itemData = ItemCache.get(itemId);
        const itemCategory = itemData.getItemCategory();
        const beforeQny = deleteInven.getItemQny();
        const afterQny = 0;
        const diffQny = afterQny - beforeQny;

        return new InvenLog({uid, itemId, itemCategory, diffQny, beforeQny, afterQny, logDate});
    }
}

module.exports = InventoryChangeDelete;
module.exports.Schema = Schema;