const mongo = require('@ss/dbMongo');
const _ = require("lodash");

module.exports = async (ctx, next) => {
    let storyData = ctx.request.body;

    let resourceList = null;
    try {
        resourceList = await mongo.getStoryResource(storyData.storyId);
    }
    catch (err) {
        console.error(err);
    }

    ctx.status = 200;
    ctx.body = resourceList;
    await next();
}