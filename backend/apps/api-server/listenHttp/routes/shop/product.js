const ReqShopProduct = require('@ss/models/controller/ReqShopProduct');

const ProductDao = require('@ss/daoMongo/ProductDao');
const ProductRewardDao = require('@ss/daoMongo/ProductRewardDao');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemDao = require('@ss/daoMongo/ItemDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');

const ProductService = require('@ss/service/ProductService');

const ValidateUtil = require('@ss/util/ValidateUtil')
const PurchaseStatus = ValidateUtil.PurchaseStatus;

const InventoryService = require('@ss/service/InventoryService');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqShopPurchase = new ReqShopProduct(ctx.request.body);
    ReqShopProduct.validModel(reqShopPurchase);

    const receipt = reqShopPurchase.getReceipt();
    const appstore = reqShopPurchase.getAppstore();
    const validateReceipt = await ProductService.validateReceipt(appstore, receipt);

    if (validateReceipt.getPurchaseStatus() === PurchaseStatus.FAIL) {
        ctx.status = 400;
        ctx.body = { message: 'receipt failed' };
        return;
    }

    const productId = ProductService.getProductId(validateReceipt);
    const productDao = new ProductDao(ctx.$dbMongo);

    const productInfo = await productDao.findOne({ productId });

    if (!productInfo) {
        ctx.status = 400;
        ctx.body = { message: 'no exist product info' };
        return;
    }

    const productRewardDao = new ProductRewardDao(ctx.$dbMongo);
    const inventoryDao = new InventoryDao(ctx.$dbMongo);
    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);
    const itemDao = new ItemDao(ctx.$dbMongo);

    const productRewardList = await productRewardDao.findMany({productId});

    const inventoryService = new InventoryService(itemCategoryDao, itemDao, inventoryDao, userInfo, updateDate);

    await inventoryService.putItem(productRewardList, InventoryService.GET_ACTION.PURCHASE);
    
    ctx.status = 200;
    ctx.body = {};


    await next();
}

/**
 * @swagger
 * resourcePath: /api
 * description: All about API
 */

/**
 * @swagger
 * path: /config
 * operations:
 *   -  httpMethod: GET
 *      summary: 로비 진입전 앱에 필요한 기본 정보.
 *      notes: |
 *        <br>version: version
 *        <br>url: cdn주소입니다.
 *        <br>policyVersion: 개인 정책 버젼
 *      responseClass: appInfo
 *      nickname: config
 *      consumes:
 *        - text/html
 */

/**
 * @swagger
 * models:
 *   appInfo:
 *     id: AppInfo
 *     properties:
 *       version:
 *         type: String
 *         required: true
 *       url:
 *         type: String
 *         required: true
 *       policyVersion:
 *         type: String
 *         required: true
 */