const ReqStoryUpdate = require('@ss/models/cmsController/ReqStoryUpdate');
const StoryDao = require('@ss/daoMongo/StoryDao');
const Story = require('@ss/models/mongo/Story');
const moment = require('moment');


module.exports = async (ctx, next) => {
    try {
        const updateDate = moment().unix();
        
        const reqStoryUpdate = new ReqStoryUpdate(ctx.request.body);
        ReqStoryUpdate.validModel(reqStoryUpdate);

        const storyId = reqStoryUpdate.getStoryId();
        const storyDao = new StoryDao(ctx.$dbMongo);

        const oldStoryData = await storyDao.findOne({ storyId });
        if (!oldStoryData) {
            console.error(err);
            ctx.status = 400;
            ctx.body = { message: 'no story' };

            await next();
            return;
        }

        const newStoryData = new Story(reqStoryUpdate);

        checkChange(newStoryData , oldStoryData);

        newStoryData.setVersion(oldStoryData.getVersion() + 1);
        newStoryData.setUpdateDate(updateDate);

        delete newStoryData[Story.Schema.STORY_ID.key];

        await storyDao.updateOne({storyId}, newStoryData);

        ctx.status = 200;
        ctx.body = {};
    }
    catch (err) {
        console.error(err);
        ctx.status = 400;
        ctx.body = { message: err.message };

        await next();
    }
}

function checkChange(newStoryData, oldStoryData) {
    let checkCount = 0;
    if( newStoryData.getStatus() !== oldStoryData.getStatus() ) checkCount++;
    if( newStoryData.getThumbnail() !== oldStoryData.getThumbnail() ) checkCount++;
    if( newStoryData.getThumbnailVersion() !== oldStoryData.getThumbnailVersion() ) checkCount++;
    if( newStoryData.getThumbnailCrc32() !== oldStoryData.getThumbnailCrc32() ) checkCount++;

    if(checkCount === 0) {
        throw new Error('no change');
    }
    
}
