const Model = require('../../models');
const InvenLog = require('../apilog/InvenLog');

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
        
        const beforeQny = deleteInven.getItemQny();
        const afterQny = 0;

        return new InvenLog({uid, itemId, beforeQny, afterQny, logDate});
    }
}

module.exports = InventoryChangeDelete;
module.exports.Schema = Schema;