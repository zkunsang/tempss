const ValidateUtil = require('@ss/util/ValidateUtil');
const AppStore = ValidateUtil.AppStore;

class ShopService {
    constructor() {

    }

    static async validateReceipt(appStore, receipt) {
        
        if (appStore === AppStore.GOOGLE) {
            return await validateReceiptGoogle(receipt);
        }
    }

    static async validateReceiptGoogle(receipt) {
        // 구글 벨리 데이트
        const productId = 'tempProductId';
        const orderId = 'orderId'
        const packageName = 'packageName';
        const purchaseStatus = '0';
        const purchaseToken = 'purchaseToken';
        return new Receipt({ productId, orderId, packageName, purchaseStatus, purchaseToken });

    }

    static getProductId(receipt) {
        const productId = receipt.getProductId();
        return productId.split('.')[4];
    }
}

module.exports = new ShopService();