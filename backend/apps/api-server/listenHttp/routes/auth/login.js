const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedis');
const UserDao = require('@ss/daoMongo/UserDao');
const SessionDao = require('@ss/daoRedis/SessionDao');
const User = require('@ss/models/mongo/User');
const SSError = require('@ss/error');
const UserStatus = require('@ss/util').UserStatus;
const ReqAuthLogin = require('@ss/models/controller/ReqAuthLogin');
const shortid = require('shortid');

const moment = require('moment');

module.exports = async (ctx, next) => {
    try {
        const loginDate = moment().unix();
        const reqAuthLogin = new ReqAuthLogin(ctx.request.body);
        ReqAuthLogin.validModel(reqAuthLogin);
        
        const uid = reqAuthLogin.getUID();

        const userDao = new UserDao(dbMongo.userConnect);
        const sessionDao = new SessionDao(dbRedis);

        let userInfo = await userDao.findOne({ uid });

        const sessionId = shortid.generate();
        
        if (userInfo) {
            const oldSessionId = userInfo.getSessionId();
            userInfo.setSessionId(sessionId);
            userInfo.setLastLoginDate(loginDate);
            await userDao.updateOne({ uid: userInfo.getUID() }, { sessionId, lastLoginDate: loginDate });
            await sessionDao.del(oldSessionId);
        }
        else {
            userInfo = new User(reqAuthLogin);
            userInfo.setStatus(UserStatus.NONE);
            userInfo.setSessionId(sessionId);
            userInfo.setLastLoginDate(loginDate);
            userInfo.setCreateDate(loginDate);
            await userDao.insertOne(userInfo);
        }

        sessionDao.set(sessionId, userInfo);
        
        ctx.status = 200;
        ctx.body = { sessionId };

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
 * path: /auth/login
 * operations:
 *   -  httpMethod: POST
 *      summary: 로그인
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
 *          dataType: reqLogin
 *          required: true
 *          
 */       
 
/**
 * @swagger
 * models:
 *   reqLogin:
 *     id: reqLogin
 *     properties:
 *       uid:
 *         type: String
 *         required: true
 *         description: 파이어 베이스에서 획득한 uid
 *       email:
 *         type: Email
 *         required: true
 *       provider:
 *         type: String
 *         required: true
 *         description: 로그인 방법(google|facebook|email)
 *       deviceId:
 *         type: number
 *         required: true
 *       platform:
 *         type: String
 *         required: true
 *         description: 플랫폼(ios|aos) aos - android os
 *       appStore:
 *         type: String
 *         required: true
 *         description: 스토어(google|onestore|appstore)
 *       clientVersion:
 *         type: String
 *         required: true
 *         description: 클라이언트 앱 버젼입니다. 
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