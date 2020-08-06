const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedis');

const ReqSession = require('@ss/models/cmsController/ReqSession');
const CmsSessionDao = require('@ss/daoRedis/CmsSessionDao');

const Admin = require('@ss/models/mongo/Admin');
const AdminDao = require('@ss/daoMongo/AdminDao');

module.exports = async (ctx, next) => {
    try {
        const reqSession = new ReqSession(ctx.request.body);
        ReqSession.validModel(reqSession);

        const cmsSessionDao = new CmsSessionDao(dbRedis);

        const sessionAdmin = new Admin(await cmsSessionDao.get(reqSession.getSessionId()));
        Admin.validModel(sessionAdmin);

        const adminDao = new AdminDao(dbMongo);

        const adminInfo = await adminDao.findOne({ adminId: sessionAdmin.getAdminId() });
        Admin.validModel(adminInfo);

        ctx.$dbMongo = dbMongo;
        ctx.$dbRedis = dbRedis;

    } catch (err) {
        console.error(err);
    }

    

    await next();
};