const Model = require('@ss/models');
const ValidateUtil = require('@ss/util');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_CATEGORY: { key: 'itemCategory', required: true, type: ValidType.STRING,  },
    CATEGORY_NAME: { key: 'categoryName', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP }
}

class Category extends Model {
    constructor({ itemCategory, categoryName }) {
        super();
        this[Schema.ITEM_CATEGORY.key] = itemCategory;
        this[Schema.CATEGORY_NAME.key] = categoryName;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getItemId() {
        return this[Schema.ITEM_ID.key] = updateDate;
    }
}

module.exports = Category;
module.exports.Schema = Schema;