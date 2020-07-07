const mongo = require('@ss/dbMongo');
const uuid = require('uuid');

module.exports = async (ctx, next) => {
    const {id, passwd} = ctx.request.body;

    const userInfo = await mongo.findUser({id});

    if(userInfo) {
        ctx.status = 400;
        ctx.body = {error: '이미 존재 하는 유저 입니다.'};
        return await next();
    }

    await mongo.createUser({id, passwd});
    let sessionId = uuid.v4().replace(/-/g, '');
    
    ctx.status = 200;
    ctx.body = { sessionId, id };
    return await next();
    
};