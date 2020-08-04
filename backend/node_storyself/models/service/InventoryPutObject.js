const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UPDATE_LIST: { key: 'insertList', required: true, type: ValidType.ARRAY },
    INSERT_LIST: { key: 'updateList', required: true, type: ValidType.ARRAY },
}

class InventoryPutObject extends Model {
    constructor({ insertList, updateList }) {
        super();
        this[Schema.UPDATE_LIST.key] = updateList;
        this[Schema.INSERT_LIST.key] = insertList;
    }

    getUpdateList() {
        return this[Schema.UPDATE_LIST.key];
    }

    getInsertList() {
        return this[Schema.INSERT_LIST.key];
    }
}

module.exports = InventoryPutObject;
module.exports.Schema = Schema;