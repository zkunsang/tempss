const Model = require('../../models');
const InvenLog = require('../apilog/InvenLog');

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
        // validation check
        if (itemId !== afterInven.getItemId()) {
            console.error('item id wrong');
            return;
        }

        const beforeQny = beforeInven.getItemQny();
        const afterQny = afterInven.getItemQny();

        return new InvenLog({uid, itemId, beforeQny, afterQny, logDate});
    }
}

module.exports = InventoryChangeUpdate;
module.exports.Schema = Schema;