

const ss = require('@ss');
const apiConfig = ss.configs.apiServer;

module.exports = async (ctx, next) => {
    try {
        ctx.status = 200;
        ctx.body = {
            url: apiConfig.cdnUrl,
            version: apiConfig.appVersion,
            policyVersion: apiConfig.policyVersion
        };    
    }
    catch(err) {
        console.error(err);
    }
    
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