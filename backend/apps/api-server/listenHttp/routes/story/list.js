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
 *        <br>appVersion: appVersion
 *        <br>cdnUrl: cdn주소입니다.
 *      responseClass: appInfo
 *      nickname: config
 *      consumes: 
 *        - text/html
 */
 
/**
 * @swagger
 * models:
 *   resource:
 *     id: resource
 *     properties:
 *       resourceId:
 *         type: String
 *       version:
 *         type: int
 *       crc32:
 *         type: String
 *       fileSize: 
 *         type: int
 *   storyInfo:
 *     id: storyInfo
 *     properties:
 *       status:
 *         type: int
 *       resourceList:
 *         type: resource  
 */

const mongo = require('@ss/dbMongo');
const _ = require('lodash');

module.exports = async (ctx, next) => {
    try {
        const storyList = await mongo.getStoryList();
        storyList.map((item) => {
            delete item.code;
            delete item.summary;
            delete item._id;
        })

        const resourceList = await mongo.getStoryResourceList();

        let resourceMap = {};
        resourceList.map((item) => {
            (resourceMap[item.storyId] || 
                (resourceMap[item.storyId] = []))
                .push(item);

            delete item._id;
            delete item.storyId;
        })
        
        
        storyList.map((item) => {
            if(resourceMap[item.storyId]) {
                item.resourceList = resourceMap[item.storyId];
            }
        })

        ctx.status = 200;
        ctx.body = storyList;    
    }
    catch(err) {
        console.error(err);
    }
    
    await next();
}