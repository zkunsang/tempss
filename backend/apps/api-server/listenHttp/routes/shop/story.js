const ReqShopStory = require('@ss/models/controller/ReqShopStory');

const ItemDao = require('@ss/daoMongo/ItemDao');
const StoryDao = require('@ss/daoMongo/StoryDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemMaterialDao = require('@ss/daoMongo/ItemMaterialDao');

const ItemService = require('@ss/service/ItemService');
const StoryService = require('@ss/service/StoryService');
const InventoryService = require('@ss/service/InventoryService');

function makeStoryInventoryList(storyList) {
    return storyList.map((item) => InventoryService.makeInventoryObject(item, 1));
}

module.exports = async (ctx, next) => {
    const reqShopStory = new ReqShopStory(ctx.request.body);
    ReqShopStory.validModel(reqShopStory);
    
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
    
    const needStoryList = reqShopStory.getStoryList();
    storyService.getStoryList(needStoryList);
    
    const storyInvenList = makeStoryInventoryList(needStoryList);

    const { putInventoryList, useInventoryList } 
        = itemService.getExchangeStoryInventoryInfo(storyInvenList);

    const inventoryService = new InventoryService(itemCategoryDao, itemDao, inventoryDao, userInfo, updateDate);
    InventoryService.validModel(inventoryService);

    await inventoryService.processExchange(useInventoryList, putInventoryList);

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