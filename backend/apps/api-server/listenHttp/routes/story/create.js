const mongo = require('@ss/dbMongo');

module.exports = async (ctx, next) => {
    const newStory = ctx.requrest.body;
    
    const createResult = await mongo.createStory(newStory);

    console.log(createResult);

    await next();
};