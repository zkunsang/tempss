const dbMongo = require('@ss/dbMongo');
const AdminDao = require('@ss/daoMongo/AdminDao');
const ReqAuthRegist = require('@ss/models/cmsController/ReqAuthRegist');
const Admin = require('@ss/models/mongo/Admin');
const AdminStatus = Admin.AdminStatus;
const AdminRole = Admin.AdminRole;
const moment = require('moment');


module.exports = async (ctx, next) => {

    try {
        const createDate = moment().unix();
        const reqAuthRegist = new ReqAuthRegist(ctx.request.body);
        ReqAuthRegist.validModel(reqAuthRegist);

        const adminDao = new AdminDao(dbMongo);
        const admin = new Admin(reqAuthRegist);
        admin.setAdminRole(AdminRole.NONE);
        admin.setStatus(AdminStatus.PENDING);
        admin.setCreateDate(createDate);

        await adminDao.insertOne(admin);
        ctx.status = 200;
        ctx.body = {};
        return await next();

    } catch(err) {
        console.error(err);
        ctx.status = 400;
        ctx.body = { error: 'error' };
        return await next();
    }
};

