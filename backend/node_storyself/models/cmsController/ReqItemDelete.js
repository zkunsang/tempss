const Model = require('@ss/models')

const ValidateUtil = require('@ss/util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
}

class ReqItemDelete extends Model {
    constructor({ itemId }) {
        super();
        this[Schema.ITEM_ID.key] = itemId;
    }

    getItemId() {
        return this[Schema.ITEM_ID.key];
    }
}

module.exports = ReqItemDelete;
module.exports.Schema = Schema;