const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedis');

const helper = require('@ss/helper');

const UserDao = require('@ss/daoMongo/UserDao');
const InventoryDao = require('@ss/daoMongo/InventoryDao');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');
const ItemDao = require('@ss/daoMongo/ItemDao');
const SessionDao = require('@ss/daoRedis/SessionDao');

const InventoryService =require('@ss/service/InventoryService');

const User = require('@ss/models/mongo/User');
const UserStatus = require('@ss/util/ValidateUtil').UserStatus;
const ReqAuthLogin = require('@ss/models/controller/ReqAuthLogin');

const LoginLog = require('@ss/models/apilog/LoginLog');

const shortid = require('shortid');

module.exports = async (ctx, next) => {
    const loginDate = ctx.$date;
    const reqAuthLogin = new ReqAuthLogin(ctx.request.body);
    ReqAuthLogin.validModel(reqAuthLogin);

    const uid = reqAuthLogin.getUID();

    const userDao = new UserDao(dbMongo);
    const sessionDao = new SessionDao(dbRedis);
    const inventoryDao = new InventoryDao(dbMongo);
    const itemCategoryDao = new ItemCategoryDao(dbMongo);
    const itemDao = new ItemDao(dbMongo);

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

    const inventoryService = new InventoryService(itemCategoryDao, itemDao, inventoryDao, userInfo, loginDate);
    
    const userInventoryList = await inventoryService.getUserInventoryList();
    InventoryService.removeObjectIdList(userInventoryList);

    ctx.status = 200;
    ctx.body.data = { 
        sessionId,
        inventoryList: userInventoryList
    };

    helper.fluent.sendLog('login', new LoginLog(reqAuthLogin, { ip: ctx.ip, loginDate }));

    await next();
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
 *        <br>uid (String): 파이어 베이스에서 획득한 uid,
 *        <br>email (Email),
 *        <br>provider (String): 로그인 방법(google|facebook|email),
 *        <br>deviceId (number),
 *        <br>platform (String): 플랫폼(ios|aos) aos - android os,
 *        <br>appStore (String): 스토어(google|onestore|appstore),
 *        <br>clientVersion (String): 클라이언트 앱 버젼입니다.
 * 
 *      responseClass: resAuthLogin
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
 *   resAuthLogin:
 *     id: resAuthLogin
 *     properties:
 *       common:
 *         type: common 
 *       error:
 *         type: error
 *       data:
 *         type: data
 *   common:
 *     id: common
 *     properties:
 *       serverTime: 
 *         type: number
 *   error:
 *     id: error
 *     properties:
 *       message:
 *         type: String
 *       additional:
 *         type: String
 *   data:
 *     id: data
 *     properties:
 *       sessionId:
 *         type: String
 *     
 *
 * */