const ReqResourceUpdate = require('@ss/models/cmsController/ReqResourceUpdate');
const Story = require('@ss/models/mongo/Story');
const moment = require('moment');
const ResourceDao = require('@ss/daoMongo/ResourceDao');
const Resource = require('@ss/models/mongo/Resource');

async function updateResourceList(resourceDao, updateList, updateDate) {
    for(const updateItem of updateList) {
        const storyId = updateItem.getStoryId();
        const resourceId = updateItem.getResourceId();
        updateItem.setUpdateDate(updateDate);

        delete updateItem[Resource.Schema.STORY_ID.key];
        delete updateItem[Resource.Schema.RESOURCE_ID.key];

        await resourceDao.updateOne({ storyId, resourceId }, updateItem);
    }
}

async function insertResourceList(resourceDao ,insertList, updateDate) {
    for(const insertItem of insertList) {
        insertItem.setUpdateDate(updateDate);
    }
    await resourceDao.insertMany(insertList);
}

module.exports = async (ctx, next) => {
    try {
        const updateDate = moment().unix();
        const reqStoryUpdate = new ReqResourceUpdate(ctx.request.body);
        ReqResourceUpdate.validModel(reqStoryUpdate);

        
        const insertList = ResourceDao.mappingList(reqStoryUpdate.getInsertList());
        const updateList = ResourceDao.mappingList(reqStoryUpdate.getUpdateList());

        const resourceDao = new ResourceDao(ctx.$dbMongo);

        await updateResourceList(resourceDao, updateList, updateDate);
        await insertResourceList(resourceDao, insertList, updateDate);

        ctx.status = 200;
        ctx.body = {};
        await next();
    }
    catch (err) {
        console.error(err);
        ctx.status = 400;
        ctx.body = { message: err.message };

        await next();
    }
}