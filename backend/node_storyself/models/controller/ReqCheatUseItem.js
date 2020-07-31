const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_QNY: { key: 'itemQny', required: true, type: ValidType.NUMBER },
}

class ReqCheatUseItem extends Model {
    constructor({ itemId, itemQny }) {
        super();
        this[Schema.ITEM_ID.key] = itemId;
        this[Schema.ITEM_QNY.key] = itemQny;
        
    }

    getItemId() {
        return this[Schema.ITEM_ID.key];
    }

    getItemQny() {
        return this[Schema.ITEM_QNY.key];
    }
}

module.exports = ReqCheatUseItem;
module.exports.Schema = Schema;