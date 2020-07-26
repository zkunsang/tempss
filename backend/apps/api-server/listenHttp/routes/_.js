const moment = require('moment');

class RequsetObj {
    constructor(ctx) {
        this.startTime = moment().unix();
        this.sessionId = ctx.headers.sessionId;
        this.body = ctx.body;
        this.url = ctx.url;

               
        
    }

    end() {
        moment().unix();
        // 
    }
}

module.exports = async (ctx, next) => {
    // ctx.$reqObj = new RequsetObj(ctx);
    

    // 세션 헤더 ctx.headers
    // req Index
    // req unixtimestamp
    // start time
    // end time
    // TODO: 
    // ip ctx.headers.host 
    // nginx 확인 route 53확인

    const result = await next();
    // ctx.$reqObj
};