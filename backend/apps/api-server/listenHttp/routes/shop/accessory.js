const ReqShopAccessory = require('@ss/models/controller/ReqShopAccessory');

const ItemDao = require('@ss/daoMongo/ItemDao');
const StoryDao = require('@ss/daoMongo/StoryDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemMaterialDao = require('@ss/daoMongo/ItemMaterialDao');

const ItemService = require('@ss/service/ItemService');
const StoryService = require('@ss/service/StoryService');
const InventoryService = require('@ss/service/InventoryService');

module.exports = async (ctx, next) => {
    const reqShopAccessory = new ReqShopAccessory(ctx.request.body);
    ReqShopAccessory.validModel(reqShopAccessory);
    
    const updateDate = ctx.$date;
    const userInfo = ctx.$userInfo;

    const itemDao = new ItemDao(ctx.$dbMongo);
    const storyDao = new StoryDao(ctx.$dbMongo);
    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);
    const inventoryDao = new InventoryDao(ctx.$dbMongo);
    const itemMaterialDao = new ItemMaterialDao(ctx.$dbMongo);
    
    const itemService = new ItemService(itemDao, itemMaterialDao);
    const storyService = new StoryService(storyDao)

    await itemService.ready();
    await storyService.ready();

    ItemService.validModel(itemService);
    StoryService.validModel(storyService);
    
    const itemId = reqShopAccessory.getItemId();
    itemService.getItemList([itemId]);
    
    const itemInventory = InventoryService.makeInventoryObject(itemId, 1);

    const { putInventoryList, useInventoryList } 
        = itemService.getExchangeInventoryInfo([itemInventory]);

    const inventoryService = new InventoryService(itemCategoryDao, itemDao, inventoryDao, userInfo, updateDate);
    InventoryService.validModel(inventoryService);

    await inventoryService.processExchange(useInventoryList, putInventoryList);

    const userInventoryList = await inventoryService.getUserInventoryList();
    ctx.status = 200;
    ctx.body.data = { inventoryList: userInventoryList };

    await next();
}

/**
 * @swagger
 * resourcePath: /shop
 * description: All about API
 */

/**
 * @swagger
 * path: /shop/accessory
 * operations:
 *   -  httpMethod: POST
 *      summary: 악세사리 구매
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *        <br>itemId: 아이템 아이디
 *      responseClass: resShopAccessory
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqShopAccessory
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqShopAccessory:
 *     id: reqShopAccessory
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       itemId:
 *         type: String
 *         required: true
 *         description: 아이템 아이디
 *   resShopAccessory:
 *     id: resShopAccessory
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 * */