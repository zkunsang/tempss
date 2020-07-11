const mongo = require('@ss/dbMongo');
const _ = require('lodash');
const ss = require('@ss');


/**
 * @swagger
 * resourcePath: /api
 * description: All about API
 */

/**
 * @swagger
 * path: /config
 * operations:
 *   -  httpMethod: POST
 *      summary: Login with username and password
 *      notes: Returns a user based on username
 *      responseClass: User
 *      nickname: login
 *      consumes: 
 *        - text/html
 *      parameters:
 *        - name: username
 *          description: Your username
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: password
 *          description: Your password
 *          paramType: query
 *          required: true
 *          dataType: string
 */


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

/**
 * @swagger
 * models:
 *   User:
 *     id: User
 *     properties:
 *       username:
 *         type: String
 *       password:
 *         type: String    
 */
