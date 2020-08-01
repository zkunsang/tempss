const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_CATEGORY: { key: 'itemCategory', required: true, type: ValidType.STRING,  },
    CATEGORY_NAME: { key: 'categoryName', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP }
}

class ItemCategory extends Model {
    constructor({ itemCategory, categoryName }) {
        super();
        this[Schema.ITEM_CATEGORY.key] = itemCategory || undefined;
        this[Schema.CATEGORY_NAME.key] = categoryName || undefined;
    }
    
    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getItemId() {
        return this[Schema.ITEM_ID.key] = updateDate;
    }
}

module.exports = ItemCategory;
module.exports.Schema = Schema;