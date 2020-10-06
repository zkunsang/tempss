const ReqCheatPurchase = require('@ss/models/controller/ReqCheatPurchase');

const ProductDao = require('@ss/daoMongo/ProductDao');
const ProductRewardDao = require('@ss/daoMongo/ProductRewardDao');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemDao = require('@ss/daoMongo/ItemDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');

const InventoryService = require('@ss/service/InventoryService');

function makeInventoryList(productRewardList) {
    return productRewardList.map((item) => item.makeInventoryObject());
}

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    
    const reqCheatPurchase = new ReqCheatPurchase(ctx.request.body);
    ReqCheatPurchase.validModel(reqCheatPurchase);
    
    const productId = reqCheatPurchase.getProductId();
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

    const inventoryList = makeInventoryList(productRewardList);
    await inventoryService.processPut(inventoryList);
    
    const userInventoryList = await inventoryService.getUserInventoryList();
    InventoryService.removeObjectIdList(userInventoryList);
    
    ctx.status = 200;
    ctx.body.data = { inventoryList: userInventoryList };

    await next();
}

/**
 * @swagger
 * resourcePath: /cheat
 * description: All about API
 */

/**
 * @swagger
 * path: /cheat/purchase
 * operations:
 *   -  httpMethod: POST
 *      summary: 치트 구매
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *      responseClass: resCheatPurchase
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqCheatPurchase
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqCheatPurchase:
 *     id: reqCheatPurchase
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       productId:
 *         type: String
 *         required: true
 *         description: 상품 아이디
 *   resCheatPurchase:
 *     id: resCheatPurchase
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 *   common:
 *     id: common
 *     properties:
 *       serverTime: 
 *         type: number
 *   error:
 *     id: error
 *     properties:
 *       message:
 *         type: String
 *       additional:
 *         type: String
 *   data:
 *     id: data
 *     properties:
 *       sessionId:
 *         type: String
 *
 * */