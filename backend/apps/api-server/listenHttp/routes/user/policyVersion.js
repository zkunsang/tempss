const ss = require('@ss');
const ReqUserPolicy = require('@ss/models/controller/ReqUserPolicy');

module.exports = async (ctx, next) => {
    const reqUserPolicy = new ReqUserPolicy(ctx.request.body);
    ReqUserPolicy.validModel(reqUserPolicy);

    const userInfo = ctx.$userInfo;

    const policyVersion = ss.configs.apiServer.policyVersion;
    const updatePolicyVersion = reqUserPolicy.getPolicyVersion();
    if (policyVersion !== updatePolicyVersion) {
        // TODO: different version
        throw new Error({ errMessage: 'wrong policyVersion' });
    }

    await userDao.update({ uid: userInfo.getUID() }, { policyVersion: policyVersion });

    ctx.status = 200;
    ctx.body.data = {};

    await next();
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