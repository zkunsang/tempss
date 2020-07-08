const mongo = require('@ss/dbMongo');

module.exports = async (ctx, next) => {
    
    const {storyId} = ctx.request.body;
    let storyData = null;
    try {
        storyData = await mongo.getStoryInfo(storyId);
    }
    catch(err) {
        console.error(err);
    }
    
    ctx.status = 200;
    ctx.body = storyData;
    
    await next();
}