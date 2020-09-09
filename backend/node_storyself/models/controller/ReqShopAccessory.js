const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
}

class ReqShopAccessory extends Model {
    constructor({ itemId }) {
        super();
        this[Schema.ITEM_ID.key] = itemId;
    }

    getItemId() {
        return this[Schema.ITEM_ID.key];
    }
}

module.exports = ReqShopAccessory;
module.exports.Schema = Schema;