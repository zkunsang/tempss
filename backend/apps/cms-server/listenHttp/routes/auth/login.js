const mongo = require('@ss/dbMongo');
const uuid = require('uuid');

module.exports = async (ctx, next) => {
    const findQuery = ctx.request.body;
    const userInfo = await mongo.findUser(findQuery);

    if(!userInfo) {
        ctx.status = 400;
        ctx.body = { error: 'error' };
        return await next();
    }

    let sessionId = uuid.v4().replace(/-/g, '');
    
    ctx.status = 200;
    ctx.body = { sessionId, id: userInfo.id };

    await next();
};