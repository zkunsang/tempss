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
    ctx.body = { itemList, itemMaterialList, productList, productGroupList, productRewardList, resourceList, storyList };;
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