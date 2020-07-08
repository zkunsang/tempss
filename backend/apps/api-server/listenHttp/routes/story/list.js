const mongo = require('@ss/dbMongo');

module.exports = async (ctx, next) => {
    
    let storyList = null;
    try {
        storyList = await mongo.getStoryList();
    }
    catch(err) {
        console.error(err);
    }
    
    ctx.status = 200;
    ctx.body = storyList;
    await next();
}