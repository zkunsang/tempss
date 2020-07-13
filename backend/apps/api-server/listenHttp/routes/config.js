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
 *   appInfo:
 *     id: AppInfo
 *     properties:
 *       appVersion:
 *         type: String
 *         required: true
 *       cdnUrl:
 *         type: String  
 *         required: true  
 */

const mongo = require('@ss/dbMongo');
const _ = require('lodash');
const ss = require('@ss');

module.exports = async (ctx, next) => {
    try {
        ctx.status = 200;
        ctx.body = {
            cdnUrl: ss.configs.apiServer.cdnUrl,
            appVersion: ss.configs.apiServer.appVersion
        };    
    }
    catch(err) {
        console.error(err);
    }
    
    await next();
}
