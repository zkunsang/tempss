const Model = require('..');
const moment = require('moment');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_CATEGORY: { key: 'itemCategory', required: true, type: ValidType.STRING },
    BEFORE_QNY: { key: 'beforeQny', required: true, type: ValidType.NUMBER },
    AFTER_QNY: { key: 'afterQny', required: true, type: ValidType.NUMBER },
    LOG_DATE: { key: 'logDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class InvenLog extends Model {
    constructor({ uid, itemId, itemCategory, beforeQny, afterQny, logDate }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.ITEM_ID.key] = itemId;
        this[Schema.ITEM_CATEGORY.key] = itemCategory;
        this[Schema.BEFORE_QNY.key] = beforeQny;
        this[Schema.AFTER_QNY.key] = afterQny;
        this[Schema.LOG_DATE.key] = moment(logDate).format();
    }
}

module.exports = InvenLog;
module.exports.Schema = Schema;