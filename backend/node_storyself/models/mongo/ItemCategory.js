const Model = require('@ss/models');
const ValidateUtil = require('@ss/util');
const ValidType = ValidateUtil.ValidType;
const CommonBoolean = ValidateUtil.CommonBoolean;

// TODO: get itemCategory list dynamically

const Schema = {
    ITEM_CATEGORY: { key: 'itemCategory', required: true, type: ValidType.STRING },
    CATEGORY_NAME: { key: 'categoryName', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class ItemCategory extends Model {
    constructor({ itemId, itemCategory, groupCode, useable, overlap, maxQny, volatileSeconds, priority }) {
        super();
        this[Schema.ITEM_CATEGORY.key] = itemCategory;
        this[Schema.CATEGORY_NAME.key] = itemCategory;
        this[Schema.UPDATE_DATE.key] = priority;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }
}

module.exports = ItemCategory;
module.exports.Schema = Schema;