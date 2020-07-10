const mongo = require('@ss/dbMongo');

module.exports = async (ctx, next) => {
    const story = ctx.request.body;

    try {
        const findQuery = { storyId: story.storyId };
        delete story.storyId;
        delete story._id;
        
        const createResult = await mongo.updateStory(findQuery, story);
        console.log(createResult);
    }
    catch (err) {
        console.error(err);
    }

    ctx.status = 200;
    ctx.body = {};

    await next();
}
