const mongo = require('@ss/dbMongo');

module.exports = async (ctx, next) => {
    const newStory = ctx.request.body;

    try {
        const createResult = await mongo.createStory(newStory);
        console.log(createResult);
    }
    catch (err) {
        console.error(err);
    }

    ctx.status = 200;
    ctx.body = newStory;

    await next();
}
