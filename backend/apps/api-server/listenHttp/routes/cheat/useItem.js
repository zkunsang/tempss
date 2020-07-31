const ReqCheatUseItem = require('@ss/models/controller/ReqCheatUseItem');

const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemDao = require('@ss/daoMongo/ItemDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');

const InventoryService = require('@ss/service/InventoryService');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    
    const reqCheatPurchase = new ReqCheatUseItem(ctx.request.body);
    ReqCheatUseItem.validModel(reqCheatPurchase);
    
    const inventoryDao = new InventoryDao(ctx.$dbMongo);
    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);
    const itemDao = new ItemDao(ctx.$dbMongo);

    const inventoryService = new InventoryService(itemCategoryDao, itemDao, inventoryDao, userInfo, updateDate);
    InventoryService.validModel(inventoryService);
    await inventoryService.useItem([reqCheatPurchase], InventoryService.USE_ACTION.PURCHASE);

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