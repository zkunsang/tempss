const Model = require('../../models');
const InvenLog = require('../apilog/InvenLog');

const ItemCache = require('../../dbCache/ItemCache');

const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    BEFORE_INVEN: { key: 'beforeInven', required: true, type: ValidType.OBJECT },
    AFTER_INVEN: { key: 'afterInven', required: true, type: ValidType.OBJECT },
}

class InventoryChangeUpdate extends Model {
    constructor({ beforeInven, afterInven }) {
        super();
        this[Schema.BEFORE_INVEN.key] = beforeInven;
        this[Schema.AFTER_INVEN.key] = afterInven;
    }

    getInvenLog(uid, logDate) {
        const beforeInven = this[Schema.BEFORE_INVEN.key];
        const afterInven = this[Schema.AFTER_INVEN.key];

        const itemId = beforeInven.getItemId();
        
        if (itemId !== afterInven.getItemId()) {
            console.error('itemId wrong');
            return;
        }

        const itemData = ItemCache.get(itemId);
        const itemCategory = itemData.getItemCategory();
        const beforeQny = beforeInven.getItemQny();
        const afterQny = afterInven.getItemQny();
        const diffQny = afterQny - beforeQny;

        return new InvenLog({uid, itemId, itemCategory, diffQny, beforeQny, afterQny, logDate});
    }
}

module.exports = InventoryChangeUpdate;
module.exports.Schema = Schema;