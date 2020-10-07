const Model = require('../../models');
const InvenLog = require('../apilog/InvenLog');
const ItemCache = require('../../dbCache/ItemCache')


const ValidateUtil = require('../../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    INSERT_INVEN: { key: 'insertInven', required: true, type: ValidType.OBJECT },
}

class InventoryChangeInsert extends Model {
    constructor({ insertInven }) {
        super();
        this[Schema.INSERT_INVEN.key] = insertInven;
    }

    getInvenLog(uid, logDate) {
        const insertInven = this[Schema.INSERT_INVEN.key];
        
        const itemId = insertInven.getItemId();

        const itemData = ItemCache.get(itemId);
        const itemCategory = itemData.getItemCategory();
        const beforeQny = 0;
        const afterQny = insertInven.getItemQny();
        const diffQny = afterQny - beforeQny;

        return new InvenLog({uid, itemId, itemCategory, diffQny, beforeQny, afterQny, logDate});
    }
}

module.exports = InventoryChangeInsert;
module.exports.Schema = Schema;