const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_QNY: { key: 'itemQny', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    CREATE_DATE: { key: 'createDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    END_DATE: { key: 'endDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class Inventory extends Model {
    constructor({ uid, itemId, itemQny, updateDate, createDate, endDate }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.ITEM_ID.key] = itemId;
        this[Schema.ITEM_QNY.key] = itemQny;
        this[Schema.UPDATE_DATE.key] = updateDate;
        this[Schema.CREATE_DATE.key] = createDate;
        this[Schema.END_DATE.key] = endDate;
        
    }

    setUID(uid) {
        this[Schema.UID.key] = uid;
    }

    setEndDate(endDate) {
        this[Schema.END_DATE.key] = endDate;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    setCreateDate(createDate) {
        this[Schema.CREATE_DATE.key] = createDate;
    }

    setItemQny(itemQny) {
        this[Schema.ITEM_QNY.key] = itemQny;
    }

    getUpdateDate() {
        return this[Schema.UPDATE_DATE.key];
    }

    getItemId() {
        return this[Schema.ITEM_ID.key];
    }

    getItemQny() {
        return this[Schema.ITEM_QNY.key];
    }

    getCreateDate() {
        return this[Schema.CREATE_DATE.key];
    }

    addItem(inventory) {
        this[Schema.ITEM_QNY.key] += inventory.getItemQny();
        this.setUpdateDate(inventory.getUpdateDate());
    }

    minusItem(inventory) {
        this[Schema.ITEM_QNY.key] -= inventory.getItemQny();
        this.setUpdateDate(inventory.getUpdateDate());
    }
}

module.exports = Inventory;
module.exports.Schema = Schema;
