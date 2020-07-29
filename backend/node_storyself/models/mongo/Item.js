const Model = require('@ss/models');
const ValidateUtil = require('@ss/util');
const ValidType = ValidateUtil.ValidType;
const CommonBoolean = ValidateUtil.CommonBoolean;

// TODO: get itemCategory list dynamically

const Schema = {
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_CATEGORY: { key: 'itemCategory', required: true, type: ValidType.STRING,  },
    GROUP_CODE: { key: 'groupCode', required: true, type: ValidType.STRING },
    USEABLE: { key: 'useable', required: true, type: ValidType.NUMBER, validRange: Object.values(CommonBoolean) },
    OVERLAP: { key: 'overlap', required: true, type: ValidType.NUMBER, validRange: Object.values(CommonBoolean) },
    MAX_QNY: { key: 'maxQny', required: true, type: ValidType.NUMBER },
    VOLATILE_SECONDS: { key: 'volatileSeconds', required: true, type: ValidType.NUMBER },
    PRIORITY: { key: 'priority', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP }
}

class Item extends Model {
    constructor({ itemId, itemCategory, groupCode, useable, overlap, maxQny, volatileSeconds, priority }) {
        super();
        this[Schema.ITEM_ID.key] = itemId;
        this[Schema.ITEM_CATEGORY.key] = itemCategory;
        this[Schema.GROUP_CODE.key] = groupCode;
        this[Schema.USEABLE.key] = useable;
        this[Schema.OVERLAP.key] = overlap;
        this[Schema.MAX_QNY.key] = maxQny;
        this[Schema.VOLATILE_SECONDS.key] = volatileSeconds;
        this[Schema.PRIORITY.key] = priority;
        this[Schema.UPDATE_DATE.key] = priority;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getItemId() {
        return this[Schema.ITEM_ID.key] = updateDate;
    }
}

module.exports = Item;
module.exports.Schema = Schema;