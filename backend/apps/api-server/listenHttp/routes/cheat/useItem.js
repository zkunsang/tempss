const ReqCheatUseItem = require('@ss/models/controller/ReqCheatUseItem');

const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemDao = require('@ss/daoMongo/ItemDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');

const InventoryService = require('@ss/service/InventoryService');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    
    const reqCheatUseItem = new ReqCheatUseItem(ctx.request.body);
    ReqCheatUseItem.validModel(reqCheatUseItem);
    
    const itemDao = new ItemDao(ctx.$dbMongo);
    const inventoryDao = new InventoryDao(ctx.$dbMongo);
    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);

    const inventoryService = new InventoryService(itemCategoryDao, itemDao, inventoryDao, userInfo, updateDate);
    InventoryService.validModel(inventoryService);

    await inventoryService.processUse(reqCheatUseItem.getInventoryList(), InventoryService.USE_ACTION.CHEAT);

    ctx.status = 200;
    ctx.body.data = {};

    await next();
}

/**
 * @swagger
 * resourcePath: /cheat
 * description: All about API
 */

/**
 * @swagger
 * path: /cheat/useItem
 * operations:
 *   -  httpMethod: POST
 *      summary: 치트 아이템 소비
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *        <br>useList: 인벤토리 리스트
 *      responseClass: resCheatUseItem
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqCheatUseItem
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqCheatUseItem:
 *     id: reqCheatUseItem
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       useList:
 *         type: array
 *         items: 
 *           type: inventory
 *         required: true
 *         description: 아이템 리스트
 *   resCheatUseItem:
 *     id: resCheatUseItem
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 * */