const ReqResourceList = require('@ss/models/cmsController/ReqResourceList');
const ResourceDao = require('@ss/daoMongo/ResourceDao')

module.exports = async (ctx, next) => {
    try {
        const reqResourceList = new ReqResourceList(ctx.request.body);
        ReqResourceList.validModel(reqResourceList);

        const resourceDao = new ResourceDao(ctx.$dbMongo);
        const resourceList = await resourceDao.findMany({storyId: reqResourceList.getStoryId()});
        
        ctx.status = 200;
        ctx.body = resourceList || [];
    }
    catch(err) {
        console.error(err);
        ctx.status = 400;
        ctx.body = { message: err.message };
    }
    
    
    await next();
}