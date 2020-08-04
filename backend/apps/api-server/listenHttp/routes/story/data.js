const ItemDao = require('@ss/daoMongo/ItemDao');

const ItemMaterialDao = require('@ss/daoMongo/ItemMaterialDao');
const ProductDao = require('@ss/daoMongo/ProductDao');
const ProductGroupDao = require('@ss/daoMongo/ProductGroupDao');
const ProductRewardDao = require('@ss/daoMongo/ProductRewardDao');
const ResourceDao = require('@ss/daoMongo/ResourceDao');
const StoryDao = require('@ss/daoMongo/StoryDao');

module.exports = async (ctx, next) => {
    const dbMongo = ctx.$dbMongo;

    const itemDao = new ItemDao(dbMongo);
    const itemMaterialDao = new ItemMaterialDao(dbMongo);
    const productDao = new ProductDao(dbMongo);
    const productGroupDao = new ProductGroupDao(dbMongo);
    const productRewardDao = new ProductRewardDao(dbMongo);
    const resourceDao = new ResourceDao(dbMongo);
    const storyDao = new StoryDao(dbMongo);

    const itemList = await itemDao.findAll();
    const itemMaterialList = await itemMaterialDao.findAll();
    const productList = await productDao.findAll();
    const productGroupList = await productGroupDao.findAll();
    const productRewardList = await productRewardDao.findAll();
    const resourceList = await resourceDao.findAll();
    const storyList = await storyDao.findAll();

    ctx.status = 200;
    ctx.body.data = { itemList, itemMaterialList, productList, productGroupList, productRewardList, resourceList, storyList };;
    await next();
}

/**
 * @swagger
 * resourcePath: /story
 * description: All about API
 */

/**
 * @swagger
 * path: /story/data
 * operations:
 *   -  httpMethod: POST
 *      summary: 스토리 데이터(임시)
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *      responseClass: resStoryData
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqStoryData
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqStoryData:
 *     id: reqStoryData
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *   resStoryData:
 *     id: resStoryData
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 *       data:
 *         type: data
 *   data:
 *     id: data
 *     properties:
 *       itemList:
 *         type: array
 *         items: 
 *           type: item
 *       itemMaterialList:
 *         type: array
 *         items:
 *           type: itemMaterial
 *       productList:
 *         type: array
 *         items:
 *           type: product
 *       productGroupList:
 *         type: array
 *         items:
 *           type: productGroup
 *       productRewardList:
 *         type: array
 *         items:
 *           type: productReward
 *       resourceList:
 *         type: array
 *         items:
 *           type: resource
 *       storyList:
 *         type: array
 *         items:
 *           type: story
 *   item:
 *     id: item
 *     properties:
 *       itemId:
 *         type: String
 *       itemCategory:
 *         type: String
 *       groupId:
 *         type: String
 *       useable:
 *         type: number
 *       overlap:
 *         type: number
 *       priority:
 *         type: number
 *   itemMaterial:
 *     id: itemMaterial
 *     properties:
 *       itemId:
 *         type: String
 *       materialId:
 *         type: String
 *       materialQny:
 *         type: number
 *   product:
 *     id: product
 *     properties:
 *       productId:
 *         type: String
 *       productType: 
 *         type: String
 *       cost:
 *         type: number
 *       google:
 *         type: String
 *       apple:
 *         type: String
 *       userLimit:
 *         type: number
 *       serverLimit:
 *         type: number
 *   productGroup:
 *     id: productGroup
 *     properties:
 *       groupId: 
 *         type: String
 *       startDate: 
 *         type: number
 *       endDate:
 *         type: number
 *       serverLimit:
 *         type: number
 *   productReward:
 *     id: productReward
 *     properties:
 *       productId:
 *         type: String
 *       rewardType:
 *         type: String
 *       rewardId:
 *         type: String
 *       rewardQny:
 *         type: Number
 *   resource:
 *     id: resource
 *     properties:
 *       storyId:
 *         type: String
 *       resourceId:
 *         type: String
 *       size:
 *         type: number
 *       version:
 *         type: number
 *       crc32:
 *         type: String
 *   story:
 *     id: story
 *     properties:
 *       storyId:
 *         type: String
 *       version:
 *         type: number
 *       thumbnail:
 *         type: String
 *       thumbnailCrc32:
 *         type: String
 *       thumbnailVersion:
 *         type: number
 * 
 * */