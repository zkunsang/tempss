const ss = require('@ss');
const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedis');
const UserDao = require('@ss/daoMongo/UserDao');
const SessionDao = require('@ss/daoRedis/SessionDao');
const SSError = require('@ss/error');
const ReqUserPolicy = require('@ss/models/controller/reqUserPolicy');

module.exports = async (ctx, next) => {
    try {
        const userDao = new UserDao(dbMongo.userConnect);
        const sessionDao = new SessionDao(dbRedis);
        const reqUserPolicy = new ReqUserPolicy(ctx.request.body);
        ReqUserPolicy.validModel(reqUserPolicy);

        const userSessionInfo = await sessionDao.get(reqUserPolicy.getSessionId());

        if (userSessionInfo) {
            // TODO: controller error;
            throw new Error({ errMessage: 'no user session info exist user' });
        }

        const userInfo = await userDao.findOne(userSessionInfo.getUID());

        if (userInfo) {
            // TODO: controller error;
            throw new Error({ errMessage: 'no exist user' });
        }


        const ssPolicyVersion = ss.configs.apiServer.policyVersion;
        const userPolicyVersion = reqUserPolicy.getPolicyVersion();
        if (ssApiVersion !== reqUserPolicy.getPolicyVersion()) {
            // TODO: different version
            throw new Error({ errMessage: 'wrong policyVersion' });
        }

        await userDao.update({ uid: userInfo.getUID() }, { policyVersion: ssApiVersion });

        ctx.status = 200;
        ctx.body = {};

        await next();
    } catch (err) {
        if (err instanceof SSError.RunTime) {
            ctx.status = 400;
            ctx.body = err;
        }
        else {
            ctx.status = 500;
            ctx.body = { error: 'internalError' };
        }
        console.error(err);

        return await next();
    }

};

/**
 * @swagger
 * resourcePath: /user
 * description: All about API
 */

/**
 * @swagger
 * path: /user/policyVersion
 * operations:
 *   -  httpMethod: POST
 *      summary: 개인 정보 보호 정책 수락
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *      responseClass: resPolicyVersion
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqUserPolicyVersion
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqUserPolicyVersion:
 *     id: reqUserPolicyVersion
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       policyVersion:
 *         type: Number
 *         required: true
 *         description: 개인정보 버젼
 *   resPolicyVersion:
 *     id: resPolicyVersion
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