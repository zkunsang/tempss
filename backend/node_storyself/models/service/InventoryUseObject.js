const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    DELETE_LIST: { key: 'deleteList', required: true, type: ValidType.ARRAY },
    UPDATE_LIST: { key: 'updateList', required: true, type: ValidType.ARRAY },
}

class InventoryUseObject extends Model {
    constructor({ updateList, deleteList }) {
        super();
        this[Schema.UPDATE_LIST.key] = updateList;
        this[Schema.DELETE_LIST.key] = deleteList;
    }

    getUpdateList() {
        return this[Schema.UPDATE_LIST.key];
    }

    getDeleteList() {
        return this[Schema.DELETE_LIST.key];
    }
}

module.exports = InventoryUseObject;
module.exports.Schema = Schema;