const ValidateUtil = require('@ss/util/ValidateUtil');
const Receipt = require('@ss/models/mongo/Receipt');
const fetch = require('node-fetch');
const AppStore = ValidateUtil.AppStore;
const helper = require('@ss/helper');
const SSError = require('@ss/error');

class ProductService {
    constructor() {
        this.accessTokenStore = null;
    }

    static async init() {
        
    }

    static async validateReceipt(uid, reqShopProduct, updateDate) {
        if (reqShopProduct.getAppStore() === AppStore.GOOGLE) {
            return await this.validateReceiptGoogle(uid, reqShopProduct, updateDate);
        }
    }

    static async validateReceiptGoogle(uid, reqShopProduct, updateDate) {

        // OAuth token획득
        const accessToken = await this.getAccessToken();
    
        // 구글 벨리 데이트
        const productId = reqShopProduct.getProductId();
        const transactionId = reqShopProduct.getTransactionId()
        const purchaseDate = reqShopProduct.getPurchaseDate();
        const purchaseState = reqShopProduct.getPurchaseState();
        const purchaseToken = reqShopProduct.getPurchaseToken();
        const packageName = reqShopProduct.getPackageName();
        const appStore = reqShopProduct.getAppStore();

        let url = `https://www.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${productId}/tokens/${purchaseToken}?access_token=${accessToken}`;
        const result = await this.checkValidate(url);

        if(result.purchaseState !== 0) {
            throw new SSError.Service(SSError.Service.Code.nonValidGoogleReceipt, `${uid} - ${purchaseToken}`);
        }

        // acknowledgementState: 1
        // consumptionState: 0
        // developerPayload: '{"developerPayload":"","is_free_trial":false,"has_introductory_price_trial":false,"is_updated":false,"accountId":""}'
        // kind: 'androidpublisher#productPurchase'
        // orderId: 'GPA.3343-7169-0659-62909'
        // purchaseState: 0
        // purchaseTimeMillis: '1601283067574'
        // purchaseType: 0
        // regionCode: 'KR'
        

        return new Receipt({ uid, productId, transactionId, purchaseDate, purchaseState, purchaseToken, packageName, appStore, updateDate });
    }

    static getProductId(productId) {
        return productId.split('.')[3];
    }

    static async checkValidate(url) {
        const result = await fetch(url);
        return await result.json();
    }

    static getAccessToken() {
        return helper.googleAuth.getAccessToken();
    }
}

module.exports = ProductService;