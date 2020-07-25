const moment = require('moment');

module.exports = async (ctx, next) => {
    console.log(`[req]${ctx.path} -- ${JSON.stringify(ctx.request.body)}`);
    
    // 세션 헤더 ctx.headers
    // req Index
    // req unixtimestamp
    // start time
    // end time
    // TODO: 
    // ip ctx.headers.host 
    // nginx 확인 route 53확인
    
    await next();
    console.log(`[res]${ctx.path} -- ${JSON.stringify(ctx.body)}`);
};