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
        ctx.body.data = { message: 'receipt failed' };
        return;
    }

    const productId = ProductService.getProductId(validateReceipt);
    const productDao = new ProductDao(ctx.$dbMongo);

    const productInfo = await productDao.findOne({ productId });

    if (!productInfo) {
        ctx.status = 400;
        ctx.body.data = { message: 'no exist product info' };
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
    ctx.body.data = {};


    await next();
}

/**
 * @swagger
 * resourcePath: /shop
 * description: All about API
 */

/**
 * @swagger
 * path: /shop/product
 * operations:
 *   -  httpMethod: POST
 *      summary: 상품 구매
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>receipt: 영수증
 *        <br>appStore (String): 스토어(google|onestore|appstore),
 *      responseClass: resShopPurchase
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqShopPurchase
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqShopPurchase:
 *     id: reqShopPurchase
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       receipt:
 *         type: String
 *         required: true
 *         description: 영수증
 *       appStore:
 *         type: String
 *         required: true
 *         description: 앱스토어
 *   resShopPurchase:
 *     id: resShopPurchase
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 * */