const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedis');

const AdminDao = require('@ss/daoMongo/adminDao');
const StoryDao = require('@ss/daoMongo/storyDao');
const CmsSessionDao = require('@ss/daoRedis/CmsSessionDao');

const Admin = require('@ss/models/mongo/Admin');
const ReqStoryList = require('@ss/models/cmsController/ReqStoryList');
const ReqSession = require('@ss/models/cmsController/ReqSession');

module.exports = async (ctx, next) => {
    try {
        const reqSession = new ReqSession(ctx.request.body);;
        ReqSession.validModel(reqSession);
        
        const reqStoryList = new ReqStoryList(ctx.request.body);
        ReqStoryList.validModel(reqStoryList);

        const cmsSessionDao = new CmsSessionDao(dbRedis);
        const result = await cmsSessionDao.get({sessionId: reqSession.getSessionId()});
        const sessionAdminInfo = new Admin(result);
        Admin.ValidModel(sessionAdminInfo);
        
        const adminDao = new AdminDao(dbMongo);
        
        const adminInfo = await adminDao.findOne({adminId: sessionAdminInfo.getAdminId()});
        Admin.ValidModel(adminInfo);

        const storyDao = new StoryDao(dbMongo);
        const storyList = storyDao.findAll();
        
        ctx.status = 200;
        ctx.body = storyList;
    }
    catch(err) {
        console.error(err);
        ctx.status = 400;
        ctx.body = { message: err.message };
    }
    
    
    await next();
}