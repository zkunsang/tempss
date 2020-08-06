const ReqCheatPutItem = require('@ss/models/controller/ReqCheatPutItem');

const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemDao = require('@ss/daoMongo/ItemDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');

const InventoryService = require('@ss/service/InventoryService');


module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;
    
    const reqCheatPutItem = new ReqCheatPutItem(ctx.request.body);
    ReqCheatPutItem.validModel(reqCheatPutItem);
    
    const itemDao = new ItemDao(ctx.$dbMongo);
    const inventoryDao = new InventoryDao(ctx.$dbMongo);
    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);

    const inventoryService = new InventoryService(itemCategoryDao, itemDao, inventoryDao, userInfo, updateDate);
    InventoryService.validModel(inventoryService);

    await inventoryService.processPut(reqCheatPutItem.getInventoryList(), InventoryService.PUT_ACTION.CHEAT);
    
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
 * path: /cheat/putItem
 * operations:
 *   -  httpMethod: POST
 *      summary: 치트 아이템 획득
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *        <br>putList: 인벤토리 리스트
 *      responseClass: resCheatPutItem
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqCheatPutItem
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqCheatPutItem:
 *     id: reqCheatPutItem
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       putList:
 *         type: array
 *         items: 
 *           type: inventory
 *         required: true
 *         description: 아이템 리스트
 *   resCheatPutItem:
 *     id: resCheatPutItem
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 *   inventory:
 *     id: inventory
 *     properties:
 *       itemId:
 *         type: String
 *         required: true
 *       itemQny:
 *         type: number
 *         required: true
 *
 * */