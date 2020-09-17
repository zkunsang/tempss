const ss = require('@ss');
const ValidateUtil = require('@ss/util/ValidateUtil');
const Receipt = require('@ss/models/mongo/Receipt');
const fetch = require('node-fetch');
const FormData = require('form-data');
const AppStore = ValidateUtil.AppStore;
const helper = require('@ss/helper');


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
        // const result = await this.checkValidate(url);

        return new Receipt({ uid, productId, transactionId, purchaseDate, purchaseState, purchaseToken, packageName, appStore, updateDate });
    }

    static getProductId(productId) {
        return productId.split('.')[3];
    }

    static async checkValidate(url) {
        const result = await fetch(url);
        return await result.json();
    }

    static async getAccessToken() {
        return '';
        
        const code = '4/4AFlMztb3xe48ueRP-mUJ32do7xVG5s-UH2jZoPv0-S2j-A-PaPKWaYuL2TerfRoMmM-ZTwaonZL3hq-zzcptrs';
        // "/google/authredirect?code=4/4AFlMztb3xe48ueRP-mUJ32do7xVG5s-UH2jZoPv0-S2j-A-PaPKWaYuL2TerfRoMmM-ZTwaonZL3hq-zzcptrs&scope=https://www.googleapis.com/auth/androidpublisher"
        const {tokens} = await helper.googleAuth.oAuth2Client.getToken(code);

        return tokens.access_token;
    }
}

module.exports = ProductService;