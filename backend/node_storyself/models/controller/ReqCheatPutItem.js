const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const InventoryDao = require('@ss/daoMongo/InventoryDao');

const Schema = {
    PUT_LIST: { key: 'putList', required: true, type: ValidType.ARRAY },
}

class ReqCheatPutItem extends Model {
    constructor({ putList }) {
        super();
        this[Schema.PUT_LIST.key] = putList;
    }

    getInventoryList() {
        return InventoryDao.mappingList(this[Schema.PUT_LIST.key]);
    }
}

module.exports = ReqCheatPutItem;
module.exports.Schema = Schema;