const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;
const AppStore = ValidateUtil.AppStore;

const Schema = {
    RECEIPT: { key: 'receipt', required: true, type: ValidType.STRING },
    APPSTORE: { key: 'appStore', required: true, type: ValidType.STRING, validRange: Object.values(AppStore) },
}

class ReqShopProduct extends Model {
    constructor({ receipt }) {
        super();
        this[Schema.RECEIPT.key] = receipt;
        this[Schema.APPSTORE.key] = appStore;
    }

    getReceipt() {
        return this[Schema.RECEIPT.key];
    }

    getAppStore() {
        return this[Schema.APPSTORE.key];
    }
}

module.exports = ReqShopProduct;
module.exports.Schema = Schema;