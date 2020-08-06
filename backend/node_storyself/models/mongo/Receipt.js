const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

// productId = 'com.illuni.storyself.google.test0001
const Schema = {
    ORDER_ID: { key: 'orderId', required: true, type: ValidType.STRING },
    PRODUCT_ID: { key: 'productId', required: true, type: ValidType.STRING },
    PACKAGE_NAME: { key: 'packageName', required: true, type: ValidType.STRING },
    PURCHASE_STATUS: { key: 'purchaseStatus', required: true, type: ValidType.STRING },
    PURCHASE_TOKEN: { key: 'purchaseToken', required: true, type: ValidType.STRING },
}

class Receipt extends Model {
    constructor({ orderId, productId, packageName, purchaseStatus, purchaseToken }) {
        super();
        this[Schema.ORDER_ID.key] = ValidateUtil.setNullUndefined(orderId);
        this[Schema.PRODUCT_ID.key] = ValidateUtil.setNullUndefined(productId);
        this[Schema.PACKAGE_NAME.key] = ValidateUtil.setNullUndefined(packageName);
        this[Schema.PURCHASE_STATUS.key] = ValidateUtil.setNullUndefined(purchaseStatus);
        this[Schema.PURCHASE_TOKEN.key] = ValidateUtil.setNullUndefined(purchaseToken);
    }

    getPurchaseStatus() {
        return this[Schema.PURCHASE_STATUS.key];
    }
}

module.exports = Receipt;
module.exports.Schema = Schema;