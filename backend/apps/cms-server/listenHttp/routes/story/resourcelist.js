const mongo = require('@ss/dbMongo');

module.exports = async (ctx, next) => {
    let storyData = ctx.request.body;
    try {
        const resourceList = await mongo.getStoryResource(storyData.storyId);

        ctx.status = 200;
        ctx.body = resourceList;
    }
    catch (err) {
        console.error(err);
    }
    
    await next();
}