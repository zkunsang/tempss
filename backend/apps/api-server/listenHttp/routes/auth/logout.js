const dbRedis = require('@ss/dbRedis');
const SessionDao = require('@ss/daoRedis/SessionDao');
const SSError = require('@ss/error');
const ReqAuthLogout = require('@ss/models/controller/ReqAuthLogout');

module.exports = async (ctx, next) => {
    try {
        const sessionDao = new SessionDao(dbRedis);
        const reqAuthLogout = new ReqAuthLogout(ctx.request.body);
        ReqAuthLogout.validModel(reqAuthLogout);
        
        await sessionDao.del(reqAuthLogout.getSessionId());
        
        ctx.status = 200;
        ctx.body = {};

        await next();
    } catch(err) {
        if( err instanceof SSError.RunTime ) {
            ctx.status = 400;
            ctx.body = err;
        }
        else {
            ctx.status = 500;
            ctx.body = {error: 'internalError'};
        }
        console.error(err);
        
        return await next();
    }
    
};

/**
 * @swagger
 * resourcePath: /auth
 * description: All about API
 */

/**
 * @swagger
 * path: /auth/logout
 * operations:
 *   -  httpMethod: POST
 *      summary: 로그아웃
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *      responseClass: response
 *      nickname: config
 *      consumes: 
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqLogout
 *          required: true
 *          
 */       
 
/**
 * @swagger
 * models:
 *   reqLogout:
 *     id: reqLogout
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *   response:
 *     id: response
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
 *   
 * */