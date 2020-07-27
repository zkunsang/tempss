const dbMongo = require('@ss/dbMongo');
const StoryDao = require('@ss/daoMongo/storyDao');
const ReqStoryList = require('@ss/models/cmsController/ReqStoryList');
const mongo = require('@ss/dbMongo');

module.exports = async (ctx, next) => {
    try {
        const reqStoryList = new ReqStoryList(ctx.request.body);
        ReqStoryList.validValue(reqStoryList);

        const sessionId = reqStoryList.getSessionId(); 

        
        storyList = await mongo.daoStory.getList();
    }
    catch(err) {
        console.error(err);
    }
    
    ctx.status = 200;
    ctx.body = storyList;
    await next();
}