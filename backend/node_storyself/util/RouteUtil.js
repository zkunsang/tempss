const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedisSS');

const ReqSession = require('@ss/models/cmsController/ReqSession');
const CmsSessionDao = require('@ss/daoRedis/CmsSessionDao');

const Admin = require('@ss/models/mongo/Admin');
const AdminDao = require('@ss/daoMongo/AdminDao');

async function sessionError(ctx, next) {
    ctx.status = 401;
    ctx.body.data = { err_message: 'session not ' };
}

async function commonAuthCheck(ctx, next) {
    try {
        const reqSession = new ReqSession(ctx.request.body);
        ReqSession.validModel(reqSession);

        const cmsSessionDao = new CmsSessionDao(dbRedis);
        const sessionId = reqSession.getSessionId();
        const adminSessionInfo = await cmsSessionDao.get(sessionId)

        if (!adminSessionInfo) {
            return sessionError(ctx, next);
        }

        const sessionAdmin = new Admin(adminSessionInfo);
        Admin.validModel(sessionAdmin);

        const adminDao = new AdminDao(dbMongo);

        const adminInfo = await adminDao.findOne({ adminId: sessionAdmin.getAdminId() });
        Admin.validModel(adminInfo);

        ctx.$dbMongo = dbMongo;
        ctx.$dbRedis = dbRedis;

        await next();

    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    commonAuthCheck
}