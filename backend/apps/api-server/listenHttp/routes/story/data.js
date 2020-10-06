const ItemMaterialCache = require('@ss/dbCache/ItemMaterialCache');
const ItemCache = require('@ss/dbCache/ItemCache');
const ProductCache = require('@ss/dbCache/ProductCache');
const ProductGroupCache = require('@ss/dbCache/ProductGroupCache');
const ProductRewardCache = require('@ss/dbCache/ProductRewardCache');
const ResourceCache = require('@ss/dbCache/ResourceCache');
const StoryCache = require('@ss/dbCache/StoryCache');

module.exports = async (ctx, next) => {
    const itemList = ItemCache.getList();
    const itemMaterialList = ItemMaterialCache.getList();
    const productList = ProductCache.getList();
    const productGroupList = ProductGroupCache.getList();
    const productRewardList = ProductRewardCache.getList();
    const resourceList = ResourceCache.getList();
    const storyList = StoryCache.getList();

    ctx.status = 200;
    ctx.body.data = { itemList, itemMaterialList, productList, productGroupList, productRewardList, resourceList, storyList };
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