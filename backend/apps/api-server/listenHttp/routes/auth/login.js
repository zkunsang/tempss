const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedis');
const UserDao = require('@ss/daoMongo/UserDao');
const SessionDao = require('@ss/daoRedis/SessionDao');
const User = require('@ss/models/mongo/user');
const ReqAuthLogin = require('@ss/models/controller/reqAuthLogin');
const shortid = require('shortid');

const moment = require('moment');

module.exports = async (ctx, next) => {
    try {
        const loginDate = moment().unix();
        const reqAuthLogin = new ReqAuthLogin(ctx.request.body);

        const uid = reqAuthLogin.getUID();

        const userDao = new UserDao(dbMongo);
        const sessionDao = new SessionDao(dbRedis);

        const userInfo = await userDao.findOne({ uid });

        const sessionId = shortid.generate();
        
        if (userInfo) {
            const oldSessionId = userInfo.getSessionId();
            userInfo.setSessionId(sessionId);
            userInfo.setLastLoginDate(loginDate);
            await userDao.updateOne(userInfo);
            await sessionDao.del(oldSessionId);
        }
        else {
            userInfo = new User(ctx.body);
            userInfo.setSessionId(sessionId);
            userInfo.setLastLoginDate(loginDate);
            await userDao.insertOne(user);
        }

        sessionDao.set(sessionId, userInfo);
        
        ctx.status = 200;
        ctx.body = { sessionId, userInfo };

        await next();
    } catch(err) {
        ctx.status = 500;
        ctx.body = { error: 'error' };
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
 * path: /auth/login
 * operations:
 *   -  httpMethod: POST
 *      summary: 로그인에 필요합니다.
 *      notes: |
 *        <br>userInfo: version
 *        <br>sessionId: 세션 아이디 입니다.
 *        <br>policyVersion: 개인 정책 버젼
 *      responseClass: response
 *      nickname: config
 *      consumes: 
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: request
 *          required: true
 *          
 */       
 
/**
 * @swagger
 * models:
 *   request:
 *     id: request
 *     properties:
 *       uid:
 *         type: String
 *         required: true
 *       email:
 *         type: email
 *         requied: true
 *       provider:
 *         type: aos
 *         requied: true
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