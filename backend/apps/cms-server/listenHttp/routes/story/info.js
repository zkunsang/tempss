const ReqStoryInfo = require('@ss/models/cmsController/ReqStoryInfo');
const StoryDao = require('@ss/daoMongo/StoryDao');

module.exports = async (ctx, next) => {
    const reqStoryInfo = new ReqStoryInfo(ctx.request.body);
    ReqStoryInfo.validModel(reqStoryInfo);

    const storyId = reqStoryInfo.getStoryId();
    const storyDao = new StoryDao(ctx.$dbMongo);

    const storyData = await storyDao.findOne({ storyId });
    if (!storyData) {
        console.error(err);
        ctx.status = 400;
        ctx.body = { message: err.message };

        await next();
    }

    ctx.status = 200;
    ctx.body = storyData;

    await next();
}