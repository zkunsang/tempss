const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    PRODUCT_ID: { key: 'productId', required: true, type: ValidType.STRING },
    GROUP_ID: { key: 'groupId', required: false, type: ValidType.STRING },
    PRODUCT_TYPE: { key: 'productType', required: true, type: ValidType.STRING },
    COST: { key: 'cost', required: true, type: ValidType.NUMBER },
    GOOGLE: { key: 'google', required: true, type: ValidType.STRING },
    APPLE: { key: 'apple', required: true, type: ValidType.STRING },
    START_DATE: { key: 'startDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    END_DATE: { key: 'endDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    SERVER_LIMIT: { key: 'serverLimit', required: true, type: ValidType.NUMBER },
    USER_LIMIT: { key: 'userLimit', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class Product extends Model {
    constructor({ productId, groupId, productType, cost, apple, google, startDate, endDate, serverLimit, userLimit }) {
        super();
        this[Schema.PRODUCT_ID.key] = productId;
        this[Schema.GROUP_ID.key] = groupId;
        this[Schema.PRODUCT_TYPE.key] = productType;
        this[Schema.COST.key] = cost;
        this[Schema.GOOGLE.key] = google;
        this[Schema.APPLE.key] = apple;
        this[Schema.START_DATE.key] = startDate;
        this[Schema.END_DATE.key] = endDate;
        this[Schema.SERVER_LIMIT.key] = serverLimit;
        this[Schema.USER_LIMIT.key] = userLimit;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getProductId() {
        return this[Schema.PRODUCT_ID.key];
    }
}

module.exports = Product;
module.exports.Schema = Schema;